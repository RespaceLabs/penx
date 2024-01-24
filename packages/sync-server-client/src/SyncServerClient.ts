import ky from 'ky'
import { Node } from '@penx/model'
import { INode, ISpace } from '@penx/model-types'

type Response<T> = {
  success: boolean
  data: T
  errorCode: string
  errorMessage: string
}

export class SyncServerClient {
  constructor(private space: ISpace) {}

  get baseURL() {
    return `${this.space.syncServerUrl}`
  }

  get token() {
    return `${this.space.syncServerAccessToken}`
  }

  getAllNodes = async () => {
    const url = `${this.baseURL}/get-all-nodes`
    const nodes = await ky
      .post(url, {
        json: {
          token: this.token,
          spaceId: this.space.id,
        },
      })
      .json<INode[]>()

    return nodes.map((node) => ({
      ...node,
      createdAt: new Date(node.createdAt),
      updatedAt: new Date(node.updatedAt),
    }))
  }

  getPullableNodes = async (localLastModifiedTime: number) => {
    const url = `${this.baseURL}/get-pullable-nodes`
    const nodes = await ky
      .post(url, {
        json: {
          token: this.token,
          spaceId: this.space.id,
          lastModifiedTime: localLastModifiedTime,
        },
      })
      .json<INode[]>()

    return nodes.map((node) => ({
      ...node,
      createdAt: new Date(node.createdAt),
      updatedAt: new Date(node.updatedAt),
    }))
  }

  pushNodes = async (nodes: INode[]) => {
    const { space } = this
    const { password } = space
    const encrypted = space.encrypted && password
    const url = `${this.baseURL}/push-nodes`
    const res = await ky
      .post(url, {
        json: {
          token: this.token,
          spaceId: space.id,
          nodes: encrypted
            ? nodes.map((node) => new Node(node).toEncrypted(password))
            : nodes,
        },
      })
      .json<Response<string>>()

    if (res.success)
      return {
        time: res.data,
      }

    if (res.errorCode === 'NODES_BROKEN') {
      throw new Error(res.errorCode)
    }

    throw new Error('UNKNOWN_ERROR')
  }
}
