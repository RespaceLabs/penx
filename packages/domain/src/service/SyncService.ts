import { Octokit } from 'octokit'
import { ChangeType, db, IDoc, ISpace } from '@penx/local-db'
import { store } from '@penx/store'
import { Doc, Space } from '../entity'

interface SharedParams {
  owner: string
  repo: string
  headers: {
    'X-GitHub-Api-Version': string
  }
}

type TreeItem = {
  path: string
  mode: '100644' | '100755' | '040000' | '160000' | '120000'
  type: 'blob' | 'tree' | 'commit'
  content?: string
  sha?: string | null
}

type Content = {
  name: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string
  git_url: string
  download_url: string
  type: 'file' | 'dir'
}

export class SyncService {
  private params: SharedParams

  private space: Space

  private docs: Doc[]
  private docsMap: Record<string, Doc>

  private app: Octokit

  private baseBranchSha: string

  spacesDir = 'spaces'

  docsDir = 'docs'

  docsTree: Content[]

  commitSha: string

  commitDate: string

  get baseBranchName() {
    return 'main'
  }

  setSharedParams() {
    const sharedParams = {
      owner: this.space.settings.repoOwner,
      repo: this.space.settings.repoName,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    }
    this.params = sharedParams
  }

  static async init(space: ISpace) {
    const s = new SyncService()

    s.space = new Space(space)

    s.setSharedParams()

    s.app = new Octokit({
      auth: s.space.settings.githubToken,
    })

    const changedIds = s.space.getChangedDocIds()

    const docs = await db.queryDocByIds(changedIds)

    s.docs = docs.map((doc) => new Doc(doc))

    s.docsMap = s.docs.reduce(
      (acc, doc) => {
        return { ...acc, [doc.id]: doc }
      },
      {} as Record<string, Doc>,
    )

    return s
  }

  private async updateRef(commitSha: string = '') {
    const branchName = this.baseBranchName
    await this.app.request('PATCH /repos/{owner}/{repo}/git/refs/{ref}', {
      ...this.params,
      ref: `heads/${branchName}`,
      sha: commitSha,
      force: true,
    })
  }

  private async commit(treeSha: string) {
    const parentSha = this.baseBranchSha

    const msg = `update docs`

    const commit = await this.app.request(
      'POST /repos/{owner}/{repo}/git/commits',
      {
        ...this.params,
        message: `[PenX] ${msg}`,
        parents: [parentSha],
        tree: treeSha,
      },
    )
    return commit
  }

  async createTreeForExistedDir(): Promise<TreeItem[]> {
    const { docsMap } = this
    let treeItems: TreeItem[] = []

    for (const [id, change] of Object.entries(this.space.changes)) {
      const doc = docsMap[id]

      if ([ChangeType.ADD, ChangeType.UPDATE].includes(change.type)) {
        treeItems.push({
          path: doc.getFullPath(),
          mode: '100644',
          type: 'blob',
          content: doc.stringify(),
        })
      }

      if (change.type === ChangeType.DELETE) {
        treeItems.push({
          path: `${this.docsDir}/${id}.json`,
          mode: '100644',
          type: 'blob',
          // sha: item.sha,
          sha: null,
        })
      }
    }

    return treeItems
  }

  async createTreeForNewDir() {
    const docsRaw = await db.doc
      .where('spaceId')
      .equals(this.space.id)
      .toArray()

    return docsRaw
      .map((doc) => new Doc(doc))
      .map<TreeItem>((doc) => ({
        path: doc.getFullPath(),
        mode: '100644',
        type: 'blob',
        content: doc.stringify(),
      }))
  }

  async getBaseBranchInfo() {
    const ref = await this.app.request(
      'GET /repos/{owner}/{repo}/git/ref/{ref}',
      {
        ...this.params,
        ref: `heads/${this.baseBranchName}`,
      },
    )

    console.log('ref===========:', ref.data.object)

    const refSha = ref.data.object.sha

    this.baseBranchSha = refSha
  }

  async getDocsTreeInfo() {
    try {
      const contentRes = await this.app.request(
        'GET /repos/{owner}/{repo}/contents/{path}',
        {
          ...this.params,
          ref: `heads/${this.baseBranchName}`,
          path: this.docsDir,
        },
      )

      this.docsTree = contentRes.data as any
    } catch (error) {
      this.docsTree = []
    }

    return this.docsTree
  }

  createSpaceTreeItem() {
    return {
      path: this.space.syncName,
      mode: '100644',
      type: 'blob',
      content: this.space.stringify(),
    } as TreeItem
  }

  private async pullSpaceInfo() {
    const spaceRes: any = await this.app.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        ...this.params,
        ref: `heads/${this.baseBranchName}`,
        path: 'space.json',
      },
    )

    if (spaceRes.data.content) {
      const space: ISpace = JSON.parse(atob(spaceRes.data.content))
      const { commitDate, commitTree, commitSha, ...rest } = space
      await db.updateSpace(this.space.id, rest)
    }
  }

  private async reloadSpaceStore() {
    const spaces = await db.listSpaces()
    store.setSpaces(spaces)
    return spaces
  }

  private updateDocAtom(doc: IDoc) {
    store.setDoc(null as any)

    // for rerender editor
    setTimeout(() => {
      store.setDoc(doc!)
    }, 0)
  }

  async push() {
    await Promise.all([this.getBaseBranchInfo(), this.getDocsTreeInfo()])

    let tree: TreeItem[] = []

    if (!this.docsTree.length) {
      const docsTree = await this.createTreeForNewDir()
      tree.push(...docsTree)
    } else {
      const docsTree = await this.createTreeForExistedDir()
      tree.push(...docsTree)
    }

    const spaceTreeItem = this.createSpaceTreeItem()
    tree.push(spaceTreeItem)

    console.log('tree x=============', tree)

    const { data } = await this.app.request(
      'POST /repos/{owner}/{repo}/git/trees',
      {
        ...this.params,
        tree,
        base_tree: this.baseBranchSha,
      },
    )

    const { data: commitData } = await this.commit(data.sha)

    console.log('commitData:', commitData)

    await this.updateRef(commitData.sha)

    const commitTree = await this.getDocsTreeInfo()

    await db.updateSpace(this.space.id, {
      commitTree,
      commitSha: commitData.sha,
      commitDate: new Date(commitData.committer.date),
      changes: {},
    })

    await this.reloadSpaceStore()
  }

  async isCanPull() {
    const now = Date.now()
    const ONE_MINUTE = 60 * 1000

    if (
      this.space.commit.timestamp &&
      now - this.space.commit.timestamp < ONE_MINUTE * 2
    ) {
      console.log('=========less than 2 minute')
      return false
    }

    const { data } = await this.app.request(
      'GET /repos/{owner}/{repo}/commits/{ref}',
      {
        ...this.params,
        ref: this.baseBranchName,
      },
    )

    const sha = data.sha
    const date = data.commit.author?.date
    const timestamp = new Date(date!).valueOf()

    this.commitSha = sha
    this.commitDate = date!

    if (sha === this.space.commit.sha) return false

    return true
  }

  async pull() {
    const docsTree = await this.getDocsTreeInfo()

    for (const item of docsTree) {
      const docRes: any = await this.app.request(
        'GET /repos/{owner}/{repo}/contents/{path}',
        {
          ...this.params,
          ref: `heads/${this.baseBranchName}`,
          path: item.path,
        },
      )

      const name: string = docRes.data.name
      const doc = await db.getDoc(name.replace(/\.json$/, ''))
      const json: IDoc = JSON.parse(decodeBase64(docRes.data.content))

      if (doc) {
        await db.updateDoc(doc.id, {
          ...json,
          content: JSON.stringify(json.content),
        })
      } else {
        await db.createDoc({
          ...json,
          content: JSON.stringify(json.content),
        })
      }
    }

    await this.pullSpaceInfo()

    const commitTree = await this.getDocsTreeInfo()

    await db.updateSpace(this.space.id, {
      commitTree,
      commitSha: this.commitSha,
      commitDate: new Date(this.commitDate!),
      changes: {},
    })

    await this.reloadSpaceStore()
    const activeDoc = await db.getDoc(this.space.activeDocId!)
    this.updateDocAtom(activeDoc!)
  }
}

function decodeBase64(base64String: string): string {
  const decodedArray = new Uint8Array(
    atob(base64String)
      .split('')
      .map((char) => char.charCodeAt(0)),
  )
  const decoder = new TextDecoder('utf-8')
  return decoder.decode(decodedArray)
}
