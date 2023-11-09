export enum NodeType {
  ROOT = 'ROOT',
  COMMON = 'COMMON',
  INBOX = 'INBOX',
  TRASH = 'TRASH',
  DAILY_NOTE = 'DAILY_NOTE',

  TAG = 'TAG',

  // Database
  DATABASE_ROOT = 'DATABASE_ROOT',
  DATABASE = 'DATABASE',
  CELL = 'CELL',
  ROW = 'ROW',
  COLUMN = 'COLUMN',
  VIEW = 'VIEW',
  FILTER = 'FILTER',
}

export interface INode {
  id: string

  parentId?: string

  spaceId: string

  databaseId?: string

  type: NodeType

  element: any

  // for dynamic data
  props: {
    date?: string // 2024-01-01
    tag?: string // tag name
    restoreId?: string // restore to original
    [key: string]: any
  }

  collapsed: boolean

  children: string[]

  openedAt: number

  createdAt: number

  updatedAt: number
}
export enum FieldType {
  Text = 'Text',
  Number = 'Number',
  SingleSelect = 'SingleSelect',
  CreatedAt = 'CreatedAt',
  UpdatedAt = 'UpdatedAt',
}

export interface IDatabaseRootNode extends INode {
  type: NodeType.DATABASE_ROOT
}

export interface IDatabaseNode extends INode {
  type: NodeType.DATABASE
  props: {
    name: string // database name, same with tag name
  }
}

export interface IColumnNode extends INode {
  parentId: string // should be database id
  type: NodeType.COLUMN
  props: {
    name: string
    description: string
    fieldType: FieldType
    isPrimary: boolean
    config: any
    width: number
  }
}

export interface IRowNode extends INode {
  parentId: string // should be database id
  type: NodeType.ROW
  props: {}
}

export interface ICellNode extends INode {
  parentId: string // should be database id
  type: NodeType.CELL
  props: {
    columnId: string
    rowId: string
    ref: string // ref to a node id
    fieldType: FieldType
    // options: Option[]
    options: any
    data: any
  }
}

export enum ViewType {
  View = 'View',
  Calendar = 'Calendar',
  Gallery = 'Gallery',
  Kanban = 'Kanban',
}

export interface IViewNode extends INode {
  parentId: string // should be database id
  type: NodeType.VIEW
  props: {
    name: string
    type: ViewType
    // stackedColumnId: string
  }
}

export interface IFilterNode extends INode {
  parentId: string // should be database id
  type: NodeType.FILTER
  props: {
    columnId: string
    viewId: string
  }
}
