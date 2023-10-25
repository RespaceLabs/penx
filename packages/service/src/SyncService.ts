import ky from 'ky'
import { Octokit } from 'octokit'
import { db } from '@penx/local-db'
import { SnapshotDiffResult, Space, User } from '@penx/model'
import { nodeAtom, spacesAtom, store } from '@penx/store'
import { trpc } from '@penx/trpc-client'
import { INode, ISpace } from '@penx/types'
import { SpaceService } from './SpaceService'

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

  private user: User

  private space: Space

  private spaceService: SpaceService

  private app: Octokit

  private baseBranchSha: string

  spacesDir = 'spaces'

  pagesTree: Content[]

  commitSha: string

  get baseBranchName() {
    return 'main'
  }

  get pagesDir() {
    return this.space.id + '/pages'
  }

  getNodeFilePath(id: string) {
    return `${this.pagesDir}/${id}.json`
  }

  setSharedParams() {
    const sharedParams = {
      owner: this.user.repoOwner,
      repo: this.user.repoName,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    }
    this.params = sharedParams
  }

  static async init(space: ISpace, user: User) {
    const s = new SyncService()
    s.user = user
    s.space = new Space(space)
    s.spaceService = new SpaceService(s.space)

    const token = await trpc.github.getTokenByAddress.query({
      address: user.address,
    })

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

    const msg = `update nodes`

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
        path: this.getNodeFilePath(id),
        mode: '100644',
        type: 'blob',
        // sha: item.sha,
        sha: null,
      })
    }

    const pages = await this.spaceService.getPages()
    const pageMap = pages.reduce(
      (acc, page) => ({ ...acc, [page[0].id]: page }),
      {} as Record<string, INode[]>,
    )

    const changeIds = [...diff.added, ...diff.updated]

    for (const id of changeIds) {
      treeItems.push({
        path: this.getNodeFilePath(id),
        mode: '100644',
        type: 'blob',
        content: JSON.stringify(pageMap[id], null, 2),
      })
    }

    return treeItems
  }

  async createTreeForNewDir() {
    const pages = await this.spaceService.getPages()

    return pages.map<TreeItem>((page) => ({
      path: this.getNodeFilePath(page[0].id),
      mode: '100644',
      type: 'blob',
      content: JSON.stringify(page, null, 2),
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

  async getPagesTreeInfo() {
    try {
      const contentRes = await this.app.request(
        'GET /repos/{owner}/{repo}/contents/{path}',
        {
          ...this.params,
          ref: `heads/${this.baseBranchName}`,
          path: this.pagesDir,
        },
      )

      this.pagesTree = contentRes.data as any
    } catch (error) {
      this.pagesTree = []
    }

    console.log('this.pagesTree:', this.pagesTree)

    return this.pagesTree
  }

  createSpaceTreeItem(version: number) {
    return {
      path: this.space.filePath,
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

  private updateDocAtom(doc: any) {
    store.set(nodeAtom, null as any)

    // for rerender editor
    setTimeout(() => {
      store.set(nodeAtom, doc!)
    }, 0)
  }

  async push() {
    let tree: TreeItem[] = []
    try {
      const serverSnapshot = await this.getSnapshot()
      console.log('serverSnapshot:', serverSnapshot)
      const diff = this.space.snapshot.diff(serverSnapshot)

      console.log('diff:', diff)

      // isEqual, don't push
      if (diff.isEqual) return

      // space.json existed
      await this.getPagesTreeInfo()

      const pagesTree = await this.createTreeForExistedDir(diff)

      tree.push(...pagesTree)

      const spaceTreeItem = this.createSpaceTreeItem(serverSnapshot.version + 1)
      tree.push(spaceTreeItem)
    } catch (error) {
      const nodesTree = await this.createTreeForNewDir()
      tree.push(...nodesTree)

      const spaceTreeItem = this.createSpaceTreeItem(1)
      tree.push(spaceTreeItem)
    }

    // console.log('tree:', tree)

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

    // update ref to GitHub after commit
    await this.updateRef(commitData.sha)

    await db.updateSpace(this.space.id, {
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
    const docsTree = await this.getPagesTreeInfo()

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
      const doc = await db.getNode(name.replace(/\.json$/, ''))
      const json: any = JSON.parse(decodeBase64(docRes.data.content))

      // if (doc) {
      //   await db.updateDoc(doc.id, {
      //     ...json,
      //     content: JSON.stringify(json.content),
      //   })
      // } else {
      //   await db.createDoc({
      //     ...json,
      //     content: JSON.stringify(json.content),
      //   })
      // }
    }

    await this.pullSpaceInfo()

    await this.reloadSpaceStore()
    const activeDoc = await db.getNode(this.space.activeNodeId!)
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
      version: data.version,
      nodeMap: JSON.parse(data.nodeMap),
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
          version: content.snapshot.version,
          nodeMap: content.snapshot.nodeMap,
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
    //   nodeMap: '',
    // })

    const url = process.env.NEXT_PUBLIC_NEXTAUTH_URL + '/api/upsert-snapshot'
    await ky
      .post(url, {
        json: {
          spaceId: this.space.id,
          version: this.space.snapshot.version,
          nodeMap: JSON.stringify(space.snapshot.nodeMap),
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
