export enum NodeStatus {
  NORMAL,
  TRASHED,
}

export interface INode {
  id: string

  parentId?: string

  spaceId: string

  element: any

  emoji?: string

  status: NodeStatus

  collapsed: boolean

  children: string[]

  openedAt: number

  createdAt: number

  updatedAt: number
}
