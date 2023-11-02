export enum NodeType {
  ROOT = 'ROOT',
  COMMON = 'COMMON',
  INBOX = 'INBOX',
  TRASH = 'TRASH',
  DAILY_NOTE = 'DAILY_NOTE',
  TAG_ROOT = 'TAG_ROOT',
  TAG = 'TAG',
  DATABASE = 'DATABASE',
}

type Column = {
  title: string
  type: string // field type
  width?: number
}

export interface INode {
  id: string

  parentId?: string

  spaceId: string

  type: NodeType

  element: any

  // for dynamic data
  props: {
    date?: string // 2024-01-01
    tag?: string // tag name
    restoreId?: string // restore to original
    columns?: Column[]
    [key: string]: any
  }

  collapsed: boolean

  children: string[]

  openedAt: number

  createdAt: number

  updatedAt: number
}
