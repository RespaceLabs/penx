export enum NodeStatus {
  NORMAL,
  TRASHED,
}

export enum NodeType {
  ROOT = 'ROOT',
  COMMON = 'COMMON',
  INBOX = 'INBOX',
  TRASH = 'TRASH',
  DAILY_NOTE = 'DAILY_NOTE',
}

export interface INode {
  id: string

  parentId?: string

  spaceId: string

  type: NodeType

  element: any

  // for dynamic data
  props: {
    name?: string
    emoji?: string
    date?: string // 2024-01-01
    [key: string]: any
  }

  status: NodeStatus

  collapsed: boolean

  children: string[]

  openedAt: number

  createdAt: number

  updatedAt: number
}
