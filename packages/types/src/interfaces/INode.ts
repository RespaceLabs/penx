export enum NodeStatus {
  NORMAL,
  TRASHED,
}

export interface INode {
  id: string

  parentId?: string

  spaceId: string

  element: any

  // for dynamic data
  props: {
    [key: string]: any
  }

  emoji?: string

  status: NodeStatus

  collapsed: boolean

  children: string[]

  openedAt: number

  createdAt: number

  updatedAt: number
}
