import ky from 'ky'
import mime from 'mime-types'
import { Octokit } from 'octokit'
import { createEditor, Editor } from 'slate'
import { db } from '@penx/local-db'
import { Node, SnapshotDiffResult, Space, User } from '@penx/model'
import { spacesAtom, store } from '@penx/store'
import { trpc } from '@penx/trpc-client'
import { IFile, INode, ISpace } from '@penx/types'
import { NodeService } from './NodeService'
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

  filesTree: Content[]

  commitSha: string

  get baseBranchName() {
    return 'main'
  }

  get pagesDir() {
    return this.space.id + '/pages'
  }

  get filesDir() {
    return this.space.id + '/files'
  }

  getNodePath(id: string) {
    return `${this.pagesDir}/${id}.json`
  }

  getFilePath(id: string) {
    return `${this.filesDir}/${id}.json`
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

    // handle deleted nodes
    for (const id of diff.deleted) {
      treeItems.push({
        path: this.getNodePath(id),
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
        path: this.getNodePath(id),
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
      path: this.getNodePath(page[0].id),
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

      this.filesTree = contentRes.data as any
    } catch (error) {
      this.filesTree = []
    }

    console.log('this.pagesTree:', this.filesTree)

    return this.filesTree
  }

  async getFilesTreeInfo() {
    try {
      const contentRes = await this.app.request(
        'GET /repos/{owner}/{repo}/contents/{path}',
        {
          ...this.params,
          ref: `heads/${this.baseBranchName}`,
          path: this.filesDir,
        },
      )

      this.filesTree = contentRes.data as any
    } catch (error) {
      this.filesTree = []
    }

    console.log('this.filesTree:', this.filesTree)

    return this.filesTree
  }

  createSpaceTreeItem(version: number) {
    return {
      path: this.space.filePath,
      mode: '100644',
      type: 'blob',
      content: this.space.stringify(version),
    } as TreeItem
  }

  async createFileTreeItem(file: IFile) {
    const content = await fileToBase64(file.value)

    const { data } = await this.app.request(
      'POST /repos/{owner}/{repo}/git/blobs',
      {
        ...this.params,
        content,
        encoding: 'base64',
      },
    )

    const ext = getFileExtension(file.value.name)
    const item: TreeItem = {
      path: `${this.space.id}/files/${file.id}.${ext}`,
      mode: '100644',
      type: 'blob',
      sha: data.sha,
    }

    return item
  }

  async createFilesTree() {
    let treeItems: TreeItem[] = []
    const files = await db.file.selectAll()

    for (const file of files) {
      const item = await this.createFileTreeItem(file)
      treeItems.push(item)
    }

    return treeItems
  }

  /**
   * pull space.json
   */
  private async pullSpaceInfo() {
    const spaceRes: any = await this.app.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        ...this.params,
        ref: `heads/${this.baseBranchName}`,
        path: `${this.space.id}/space.json`,
      },
    )

    if (spaceRes.data.content) {
      const space: ISpace = JSON.parse(atob(spaceRes.data.content))
      await db.updateSpace(this.space.id, space)
    }
  }

  private async reloadSpacesStore() {
    const spaces = await db.listSpaces()
    store.set(spacesAtom, spaces)
    return spaces
  }

  async getFilesTreeByDiff(diff: SnapshotDiffResult) {
    const ids = [...diff.added, ...diff.updated]
    const nodesRaw = await db.listNormalNodes(this.space.id)
    const nodes = nodesRaw.map((n) => new Node(n))

    const fileIds: string[] = []

    // get fileIds
    for (const id of ids) {
      const node = await db.getNode(id)
      const nodeService = new NodeService(new Node(node), nodes)
      const value = nodeService.getEditorValue()
      const editor = createEditor()
      editor.insertNodes(value)

      const entries = Editor.nodes(editor, {
        at: [],
        match: (n: any) => n.type === 'img',
      })
      for (const [item] of entries) {
        fileIds.push((item as any).fileId)
      }
    }

    let tree: TreeItem[] = []

    for (const id of fileIds) {
      const file = await db.getFile(id)

      const item = await this.createFileTreeItem(file)
      tree.push(item)
    }

    return tree
  }

  async pushAll() {
    let tree: TreeItem[] = []

    const nodesTree = await this.createTreeForNewDir()
    tree.push(...nodesTree)

    const filesTree = await this.createFilesTree()
    tree.push(...filesTree)

    const spaceTreeItem = this.createSpaceTreeItem(1)
    tree.push(spaceTreeItem)
    return tree
  }

  async pushByDiff(diff: SnapshotDiffResult, serverVersion: number) {
    let tree: TreeItem[] = []

    // space.json existed
    await this.getPagesTreeInfo()

    const pagesTree = await this.createTreeForExistedDir(diff)

    tree.push(...pagesTree)

    const spaceTreeItem = this.createSpaceTreeItem(serverVersion + 1)
    tree.push(spaceTreeItem)

    const filesTree = await this.getFilesTreeByDiff(diff)
    tree.push(...filesTree)

    return tree
  }

  async push() {
    try {
      // TODO: should improve, to many try/catch

      let tree: TreeItem[] = []
      try {
        const serverSnapshot = await this.getSnapshot()
        console.log('serverSnapshot:', serverSnapshot, 'space:', this.space)

        if (
          !this.space.snapshot?.version ||
          this.space.snapshot.version < serverSnapshot.version
        ) {
          console.log('should pull, can not push!!!')
          return
        }

        const diff = this.space.snapshot.diff(serverSnapshot)

        // isEqual, don't push
        if (diff.isEqual) {
          console.log('diff equal, no need to push')
          return
        }

        tree = await this.pushByDiff(diff, serverSnapshot.version)
      } catch (error) {
        tree = await this.pushAll()
      }

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

      // create a commit for the tree
      const { data: commitData } = await this.commit(data.sha)

      // update ref to GitHub server after commit
      await this.updateRef(commitData.sha)

      await db.updateSpace(this.space.id, {
        snapshot: this.space.snapshot.toJSON(),
      })

      const spaces = await this.reloadSpacesStore()

      const activeSpace = spaces.find((s) => s.id === this.space.id)
      await this.upsertSnapshot(activeSpace!)
    } catch (error) {
      console.log('push error', error)
    }
  }

  async isCanPull() {
    const now = Date.now()
    const ONE_MINUTE = 60 * 1000
    return true
  }

  async pullAll() {
    const filesTree = await this.getFilesTreeInfo()

    for (const item of filesTree) {
      const fileRes: any = await this.app.request(
        'GET /repos/{owner}/{repo}/contents/{path}',
        {
          ...this.params,
          ref: `heads/${this.baseBranchName}`,
          path: item.path,
        },
      )

      // console.log('item==========:', item)

      const file = base64ToFile(
        fileRes.data.content,
        item.name,
        mime.lookup(item.name) as string,
      )

      await db.createFile({
        id: item.name.split('.')[0],
        spaceId: this.space.id,
        value: file,
      })

      // const content = decodeBase64(fileRes.data.content)
      // console.log('content:', fileRes.data.content)
      // console.log('file:', file)
    }
    // return

    const pagesTree = await this.getPagesTreeInfo()

    for (const item of pagesTree) {
      const pageRes: any = await this.app.request(
        'GET /repos/{owner}/{repo}/contents/{path}',
        {
          ...this.params,
          ref: `heads/${this.baseBranchName}`,
          path: item.path,
        },
      )

      const nodes: INode[] =
        JSON.parse(decodeBase64(pageRes.data.content)) || []

      for (const item of nodes) {
        const node = await db.getNode(item.id)
        if (node) {
          await db.updateNode(node.id, item)
        } else {
          await db.createNode(item)
        }
      }
    }
  }

  async pullByDiff() {
    const serverSnapshot = await this.getSnapshot()

    if (this.space.snapshot.version >= serverSnapshot.version) {
      console.log('version is equal, no need to pull!!!')
      return
    }

    console.log('serverSnapshot:', serverSnapshot)
    console.log('this:', this.space.snapshot)

    const diff = this.space.snapshot.diff(serverSnapshot, 'PULL')

    console.log('diff:', diff)
    // return

    if (diff.isEqual) return

    for (const id of diff.deleted) {
      await db.deleteNode(id)
    }

    const list = [
      ...diff.added.map((id) => ({ id, isAdd: true })),
      ...diff.updated.map((id) => ({ id, isAdd: false })),
    ]

    for (const { id, isAdd } of list) {
      const pageRes: any = await this.app.request(
        'GET /repos/{owner}/{repo}/contents/{path}',
        {
          ...this.params,
          ref: `heads/${this.baseBranchName}`,
          path: this.getNodePath(id),
        },
      )

      const nodes: INode[] =
        JSON.parse(decodeBase64(pageRes.data.content)) || []

      for (const item of nodes) {
        if (!isAdd) {
          await db.updateNode(item.id, item)
        } else {
          await db.createNode(item)
        }
      }
    }
  }

  async pull() {
    try {
      if (!this.space?.snapshot?.version) {
        console.log('pull all......')
        await this.pullAll()
      } else {
        console.log('pull by diff......')
        await this.pullByDiff()
      }
      // return

      await this.pullSpaceInfo()

      const nodes = await db.listNormalNodes(this.space.id)
      const activeNode = await db.getNode(this.space.activeNodeId!)
      const spaces = await db.listSpaces()

      store.setSpaces(spaces)
      store.setNodes(nodes)
      store.reloadNode(activeNode)
    } catch (error) {
      console.log('pull error', error)
    }
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

    console.log('this.user-=======:', this.user)

    await ky
      .post(url, {
        json: {
          address: this.user.address,
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

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1]
      // const base64String = reader.result as string
      resolve(base64String)
    }

    reader.onerror = (error) => {
      reject(error)
    }

    reader.readAsDataURL(file)
  })
}

function getFileExtension(fileName: string): string {
  const fileExtension: string = fileName.split('.').pop()?.toLowerCase() || ''
  return fileExtension
}

function base64ToFile(
  base64String: string,
  fileName: string,
  mimeType: string,
): File {
  const byteCharacters = atob(base64String)
  const byteArrays: Uint8Array[] = []

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  const blob = new Blob(byteArrays, { type: mimeType })

  return new File([blob], fileName, { type: mimeType })
}
