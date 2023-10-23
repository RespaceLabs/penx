export enum NodeStatus {
  NORMAL,
  TRASHED,
}

export interface INode {
  id: string

  spaceId: string

  element: any

  emoji?: string

  status: NodeStatus

  children: string[]

  openedAt: number

  createdAt: number

  updatedAt: number
}
