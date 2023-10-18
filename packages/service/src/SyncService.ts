import ky from 'ky'
import { Octokit } from 'octokit'
import { db } from '@penx/local-db'
import { Doc, SnapshotDiffResult, Space } from '@penx/model'
import { docAtom, spacesAtom, store } from '@penx/store'
import { trpc } from '@penx/trpc-client'
import { IDoc, ISpace } from '@penx/types'

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
  content?: string
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

  private app: Octokit

  private baseBranchSha: string

  spacesDir = 'spaces'

  docsDir = 'docs'

  docsTree: Content[]

  commitSha: string

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

  static async init(space: ISpace, address: string) {
    const s = new SyncService()
    s.space = new Space(space)

    const token = await trpc.github.getTokenByInstallationId.query({
      address,
      spaceId: space.id,
    })

    console.log('=======token:', token)

    s.setSharedParams()

    s.app = new Octokit({ auth: token })

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

  async createTreeForExistedDir(diff: SnapshotDiffResult): Promise<TreeItem[]> {
    let treeItems: TreeItem[] = []

    // handle deleted docs
    for (const id of diff.deleted) {
      treeItems.push({
        path: `${this.docsDir}/${id}.json`,
        mode: '100644',
        type: 'blob',
        // sha: item.sha,
        sha: null,
      })
    }

    const changeIds = [...diff.added, ...diff.updated]
    const docsRaw = await db.listDocByIds(changeIds)
    const docs = docsRaw.map((doc) => new Doc(doc))

    for (const doc of docs) {
      treeItems.push({
        path: doc.getFullPath(),
        mode: '100644',
        type: 'blob',
        content: doc.stringify(),
      })
    }

    return treeItems
  }

  async createTreeForNewDir() {
    const docsRaw = await db.listDocsBySpaceId(this.space.id)

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

    console.log('base branch info===========:', ref.data.object)

    const refSha = ref.data.object.sha

    this.baseBranchSha = refSha
  }

  async getSpaceInfo() {
    const res = await this.app.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        ...this.params,
        path: '/space.json',
      },
    )
    return res.data
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

    console.log('this.docsTree:', this.docsTree)

    return this.docsTree
  }

  createSpaceTreeItem(version: number) {
    return {
      path: this.space.syncName,
      mode: '100644',
      type: 'blob',
      content: this.space.stringify(version),
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
      await db.updateSpace(this.space.id, space)
    }
  }

  private async reloadSpaceStore() {
    const spaces = await db.listSpaces()
    store.set(spacesAtom, spaces)
    return spaces
  }

  private updateDocAtom(doc: IDoc) {
    store.set(docAtom, null as any)

    // for rerender editor
    setTimeout(() => {
      store.set(docAtom, doc!)
    }, 0)
  }

  async push() {
    let tree: TreeItem[] = []
    try {
      const serverSnapshot = await this.getSnapshot()
      const diff = this.space.snapshot.diff(serverSnapshot)

      console.log('serverSnapshot:', serverSnapshot)

      console.log('difff.........', diff)

      // isEqual, don't push
      if (diff.isEqual) return

      // space.json existed
      await this.getDocsTreeInfo()
      const docsTree = await this.createTreeForExistedDir(diff)

      tree.push(...docsTree)

      const spaceTreeItem = this.createSpaceTreeItem(serverSnapshot.version + 1)
      tree.push(spaceTreeItem)
    } catch (error) {
      const docsTree = await this.createTreeForNewDir()
      tree.push(...docsTree)

      const spaceTreeItem = this.createSpaceTreeItem(1)
      tree.push(spaceTreeItem)
    }

    console.log('tree to commit=============', tree)

    await this.getBaseBranchInfo()

    // update tree to GitHub before commit
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

    // update ref to GitHub after commit
    await this.updateRef(commitData.sha)

    await db.updateSpace(this.space.id, {
      changes: {},
      snapshot: this.space.snapshot.toJSON(),
    })

    const spaces = await this.reloadSpaceStore()

    const activeSpace = spaces.find((s) => s.id === this.space.id)
    await this.upsertSnapshot(activeSpace!)
  }

  async isCanPull() {
    const now = Date.now()
    const ONE_MINUTE = 60 * 1000
    //
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

    await db.updateSpace(this.space.id, {
      changes: {},
    })

    await this.reloadSpaceStore()
    const activeDoc = await db.getDoc(this.space.activeDocId!)
    this.updateDocAtom(activeDoc!)
  }

  private async getSnapshotFromDatabase(): Promise<ISpace['snapshot']> {
    const url = process.env.NEXT_PUBLIC_NEXTAUTH_URL + '/api/get-snapshot'
    const data = await ky
      .get(url, {
        searchParams: {
          spaceId: this.space.id,
        },
        retry: {
          limit: 2,
        },
      })
      .json<any>()

    return {
      repo: this.space.settings.repo,
      version: data.version,
      hashMap: JSON.parse(data.hashMap),
    }
  }

  private async getSnapshotFromGithub() {
    ///
  }

  private async getSnapshot(): Promise<ISpace['snapshot']> {
    try {
      return this.getSnapshotFromDatabase()
    } catch (error) {
      try {
        const data = (await this.getSpaceInfo()) as Content
        const content: ISpace = JSON.parse(decodeBase64(data.content!))

        return {
          repo: content.snapshot.repo,
          version: content.snapshot.version,
          hashMap: content.snapshot.hashMap,
        }
      } catch (e) {
        throw e
      }
    }
  }

  private async upsertSnapshot(space: ISpace) {
    // await trpc.snapshot.upsert.mutate({
    //   spaceId: this.space.id,
    //   version: 1,
    //   timestamp: Date.now(),
    //   hashMap: '',
    // })

    const url = process.env.NEXT_PUBLIC_NEXTAUTH_URL + '/api/upsert-snapshot'
    await ky
      .post(url, {
        json: {
          repo: this.space.settings.repo,
          spaceId: this.space.id,
          version: this.space.snapshot.version,
          hashMap: JSON.stringify(space.snapshot.hashMap),
        },
      })
      .json()
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
