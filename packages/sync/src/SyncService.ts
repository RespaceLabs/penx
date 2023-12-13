import mime from 'mime-types'
import { Octokit } from 'octokit'
import { createEditor, Editor } from 'slate'
import { PENX_101 } from '@penx/constants'
import { decryptString } from '@penx/encryption'
import { db } from '@penx/local-db'
import { Node, SnapshotDiffResult, Space, User } from '@penx/model'
import { IFile, INode, ISpace, NodeType } from '@penx/model-types'
import { nodeToSlate } from '@penx/serializer'
import { trpc } from '@penx/trpc-client'
import { SpaceService } from './SpaceService'

export type TreeItem = {
  path: string
  // mode: '100644' | '100755' | '040000' | '160000' | '120000'
  mode: '100644'
  // type: 'blob' | 'tree' | 'commit'
  type: 'blob'
  content?: string
  sha?: string | null
}

type FileNode = {
  fileId: string
  mime: string
}

interface SharedParams {
  owner: string
  repo: string
  headers: {
    'X-GitHub-Api-Version': string
  }
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
  password: any

  private params: SharedParams

  private user: User

  private space: Space

  private nodes: INode[]

  private spaceService: SpaceService

  private app: Octokit

  private baseBranchSha: string

  spacesDir = 'spaces'

  filesTree: Content[]

  commitSha: string

  enableEncryption: boolean = false

  get baseBranchName() {
    return 'main'
  }

  get pagesDir() {
    return this.space.id + '/pages'
  }

  get filesDir() {
    return this.space.id + '/files'
  }

  get isPenx101() {
    return this.user.repoName === PENX_101
  }

  getNodePath(id: string) {
    return `${this.pagesDir}/${id}.json`
  }

  getFilePath(id: string, mimeType: string) {
    return `${this.filesDir}/${id}.${mime.extension(mimeType)}`
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
    s.nodes = await db.listNodesBySpaceId(space.id)

    s.user = user
    s.space = new Space(space)
    s.spaceService = new SpaceService(space, s.nodes)

    const token = await trpc.github.getTokenByUserId.query({
      userId: user.id,
    })

    s.setSharedParams()

    s.app = new Octokit({ auth: token })

    s.password = space.password

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

    const pageMap = this.spaceService.getPageMap()

    const changeIds = [...diff.added, ...diff.updated]

    for (const id of changeIds) {
      treeItems.push({
        path: this.getNodePath(id),
        mode: '100644',
        type: 'blob',
        content: JSON.stringify(pageMap[id], null, 2),
      })
    }

    console.log('treeItems:', treeItems)

    return treeItems
  }

  async createTreeForNewDir() {
    const pageMap = this.spaceService.getPageMap()

    let treeItems: TreeItem[] = []
    for (const id of Object.keys(pageMap)) {
      const nodes = pageMap[id]
      treeItems.push({
        path: this.getNodePath(id),
        mode: '100644',
        type: 'blob',
        content: JSON.stringify(nodes, null, 2),
      })
    }

    return treeItems
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

    // console.log('this.pagesTree:', this.filesTree)

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

  async createSpaceTreeItem() {
    return {
      path: this.space.filePath,
      mode: '100644',
      type: 'blob',
      content: this.space.stringify(),
    } as TreeItem
  }

  async createPenx101TreeItem() {
    return {
      path: 'nodes.json',
      mode: '100644',
      type: 'blob',
      content: JSON.stringify(this.nodes, null, 2),
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

  async getFileNodesInNodeIds(nodeIds: string[]) {
    const nodesRaw = await db.listNodesBySpaceId(this.space.id)
    const nodes = nodesRaw.map((n) => new Node(n))

    const fileNodes: FileNode[] = []

    // get fileIds
    for (const nodeId of nodeIds) {
      const node = await db.getNode(nodeId)
      const value = nodeToSlate(node, nodesRaw)
      const editor = createEditor()
      editor.insertNodes(value)

      const entries = Editor.nodes(editor, {
        at: [],
        match: (n: any) => n.type === 'img',
      })

      for (const [item] of entries) {
        fileNodes.push(item as any)
      }
    }

    return fileNodes
  }

  private changesToNodeIds(changes: string[]) {
    const nodeIds: string[] = changes
      .filter((item) => item !== NodeType.ROOT)
      .map((item) => {
        const node = this.nodes.find((n) => n.type === (item as any))
        if (node) return node.id
        return item
      })
    return nodeIds
  }

  async getFilesTreeByDiff(diff: SnapshotDiffResult) {
    let tree: TreeItem[] = []

    const changes = [...diff.added, ...diff.updated]

    const nodeIds = this.changesToNodeIds(changes)

    const fileNode = await this.getFileNodesInNodeIds(nodeIds)

    for (const { fileId } of fileNode) {
      const file = await db.getFile(fileId)

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

    const spaceTreeItem = await this.createSpaceTreeItem()
    tree.push(spaceTreeItem)

    return tree
  }

  async pushByDiff(diff: SnapshotDiffResult) {
    let tree: TreeItem[] = []

    // space.json existed
    await this.getPagesTreeInfo()

    const pagesTree = await this.createTreeForExistedDir(diff)

    tree.push(...pagesTree)

    const spaceTreeItem = await this.createSpaceTreeItem()
    tree.push(spaceTreeItem)

    const filesTree = await this.getFilesTreeByDiff(diff)
    tree.push(...filesTree)

    if (this.isPenx101) {
      const penx101 = await this.createPenx101TreeItem()
      tree.push(penx101)
    }
    return tree
  }

  async push() {
    let tree: TreeItem[] = []

    const { pageSnapshot } = this.space

    if (
      !pageSnapshot?.pageMap ||
      !Object.keys(pageSnapshot.pageMap || {}).length ||
      pageSnapshot.version === 0
    ) {
      console.log('push all................:', pageSnapshot)
      tree = await this.pushAll()
      await this.pushTree(tree)
    } else {
      try {
        const { pageMap: prevPageMap, version: prevVersion } = pageSnapshot

        const curPageMap = this.spaceService.getPageMapHash()

        const diff = this.space.snapshot.diff(curPageMap, prevPageMap)

        console.log('====git diff:', diff)

        // isEqual, don't push
        if (diff.isEqual) {
          console.log('diff equal, no need to push')
          return
        }

        tree = await this.pushByDiff(diff)
        // console.log('tree------:', tree)
        await this.pushTree(tree)
      } catch (error) {
        console.log('push all by fallback................')
        tree = await this.pushAll()
        await this.pushTree(tree)
      }
    }
  }

  async pushTree(tree: TreeItem[]) {
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

    const curPageMap = this.spaceService.getPageMapHash()
    const newVersion = this.space.pageSnapshot.version + 1

    // update local snapshot
    await db.updateSpace(this.space.id, {
      pageSnapshot: {
        version: newVersion,
        pageMap: curPageMap,
      },
    })
  }

  decrypt(str: string) {
    if (!this.enableEncryption) return str
    return decryptString(str, this.password)
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
