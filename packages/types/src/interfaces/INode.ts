export enum NodeStatus {
  NORMAL,
  TRASHED,
}

export enum NodeType {
  COMMON,
  INBOX,
  TRASH,
}

export interface INode {
  id: string

  parentId?: string

  spaceId: string

  type: NodeType

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
