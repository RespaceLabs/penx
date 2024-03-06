import ky from 'ky'
import { decryptString } from '@penx/encryption'
import { getPassword } from '@penx/master-password'
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
    return this.space.syncServerUrl || ''
  }

  get token() {
    return this.space.syncServerAccessToken || ''
  }

  toRaw = (value: any, password: string) => {
    return typeof value === 'object'
      ? value
      : JSON.parse(decryptString(value as string, password))
  }

  getAllNodes = async () => {
    if (!this.baseURL) return []

    const password = await getPassword()

    const url = `${this.baseURL}/getAllNodes`
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
      element: this.toRaw(node.element as string, password),
      props: this.toRaw(node.props as any, password),
      createdAt: new Date(node.createdAt),
      updatedAt: new Date(node.updatedAt),
    }))
  }

  getNodesLastUpdatedAt = async () => {
    const url = `${this.baseURL}/getNodesLastUpdatedAt`
    const res = await ky
      .post(url, {
        json: {
          token: this.token,
          spaceId: this.space.id,
        },
      })
      .json<{ updatedAt: number | null }>()

    return res.updatedAt
  }

  getPullableNodes = async (localLastModifiedTime: number) => {
    const password = await getPassword()
    const url = `${this.baseURL}/getPullableNodes`
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
      element: this.toRaw(node.element as string, password),
      props: this.toRaw(node.props as any, password),
      createdAt: new Date(node.createdAt),
      updatedAt: new Date(node.updatedAt),
    }))
  }

  pushNodes = async (nodes: INode[]) => {
    const { space } = this
    const password = await getPassword()
    if (!password) throw new Error('master password not found')

    const url = `${this.baseURL}/pushNodes`
    const res = await ky
      .post(url, {
        json: {
          token: this.token,
          spaceId: space.id,
          nodes: nodes.map((node) => new Node(node).toEncrypted(password)),
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
