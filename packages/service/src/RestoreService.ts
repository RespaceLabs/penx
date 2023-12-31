import mime from 'mime-types'
import { Octokit } from 'octokit'
import { createEditor, Editor } from 'slate'
import { decryptString } from '@penx/encryption'
import { db } from '@penx/local-db'
import { Node, SnapshotDiffResult, Space, User } from '@penx/model'
import { IFile, INode, ISpace, NodeType } from '@penx/model-types'
import { trpc } from '@penx/trpc-client'
import { uniqueId } from '@penx/unique-id'

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

export class RestoreService {
  password: any

  private params: SharedParams

  private user: User

  nodes: INode[]

  space: ISpace

  filesTree: Content[]

  private app: Octokit

  spaceId: string

  commitHash: string

  get baseBranchName() {
    return 'main'
  }

  get pagesDir() {
    return this.spaceId + '/pages'
  }

  getNodePath(id: string) {
    return `${this.pagesDir}/${id}.json`
  }

  setSharedParams(repoOwner: string, repoName: string) {
    const sharedParams = {
      owner: repoOwner,
      repo: repoName,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    }
    this.params = sharedParams
  }

  static async init(user: User, url: string, password: string) {
    const s = new RestoreService()
    s.user = user

    const arr = url.split('/')
    const commitHash = arr[arr.length - 2]
    s.commitHash = commitHash
    s.spaceId = arr[arr.length - 1]

    const token = await trpc.github.getTokenByUserId.query({
      userId: user.id,
    })

    s.setSharedParams(arr[3], arr[4])

    s.app = new Octokit({ auth: token })

    s.password = password

    return s
  }

  async pull() {
    let nodes: INode[] = []
    try {
      await this.pullSpaceInfo()
      const pagesTree = await this.getPagesTreeInfo()

      for (const item of pagesTree) {
        const pageRes: any = await this.app.request(
          'GET /repos/{owner}/{repo}/contents/{path}',
          {
            ...this.params,
            ref: this.commitHash,
            path: item.path,
          },
        )

        const originalContent = JSON.parse(decodeBase64(pageRes.data.content))
        nodes = [...nodes, ...originalContent]
      }
    } catch (error) {
      throw new Error('GitHub backup url is invalid')
    }

    // console.log('=============this.password:', this.password)

    if (this.password && this.space.encrypted) {
      try {
        this.nodes = nodes.map((n) => new Node(n).toDecrypted(this.password))
      } catch (error) {
        throw new Error('Password is wrong')
      }
    } else {
      this.nodes = nodes
    }

    console.log('=========nodes:', this.nodes, 'space:', this.space)
    // return

    this.nodes = this.normalizeNodes(this.nodes)

    /**
     * save to local db
     */
    if (this.space && this.nodes.length) {
      const currentSpace = await db.getSpace(this.space.id)

      if (currentSpace) {
        await db.deleteSpace(this.space.id)

        await db.createSpace({
          ...this.space,
          password: this.password,
          pageSnapshot: currentSpace.pageSnapshot,
          nodeSnapshot: currentSpace.nodeSnapshot,
        })
      } else {
        await db.createSpace({
          ...this.space,
          password: this.password,
        })
      }

      const currentNodes = await db.listNodesBySpaceId(this.space.id)

      for (const item of currentNodes) {
        await db.deleteNode(item.id)
      }

      // console.log('=========nodes:', this.nodes)

      for (const item of this.nodes) {
        await db.createNode({
          ...item,
        })
      }
    }

    return this.space
  }

  private async pullSpaceInfo() {
    const spaceRes: any = await this.app.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        ...this.params,
        // ref: `heads/${this.baseBranchName}`,
        ref: this.commitHash,
        path: `${this.spaceId}/space.json`,
      },
    )

    if (spaceRes.data.content) {
      const originalContent = atob(spaceRes.data.content)
      const space: ISpace = JSON.parse(originalContent)

      this.space = space
    }
  }

  async getPagesTreeInfo() {
    try {
      const contentRes = await this.app.request(
        'GET /repos/{owner}/{repo}/contents/{path}',
        {
          ...this.params,
          ref: this.commitHash,
          path: this.pagesDir,
        },
      )

      console.log(
        'commitHash:',
        this.commitHash,
        'this.pagesDir:',
        this.pagesDir,
      )

      this.filesTree = contentRes.data as any
    } catch (error) {
      console.log('======pull pages error:', error)

      this.filesTree = []
    }

    console.log('this.pagesTree:', this.filesTree)

    return this.filesTree
  }

  decrypt(str: string) {
    return decryptString(str, this.password)
  }

  normalizeNodes(nodes: INode[]) {
    const nodeMap = new Map<string, INode>()

    for (const node of nodes) {
      nodeMap.set(node.id, node)
    }

    // rm invalid children
    for (const item of nodes) {
      item.children = item.children.filter((id) => nodeMap.get(id))
    }

    return nodes
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
