export enum NodeType {
  ROOT = 'ROOT',
  COMMON = 'COMMON',
  INBOX = 'INBOX',
  TRASH = 'TRASH',
  FAVORITE = 'FAVORITE',
  DAILY = 'DAILY',

  DAILY_ROOT = 'DAILY_ROOT',

  // Database
  DATABASE_ROOT = 'DATABASE_ROOT',

  DATABASE = 'DATABASE',
  CELL = 'CELL',
  ROW = 'ROW',
  COLUMN = 'COLUMN',
  VIEW = 'VIEW',
  FILTER = 'FILTER',
  OPTION = 'OPTION',
}

export interface INode {
  id: string

  spaceId: string

  parentId?: string

  databaseId?: string

  type: NodeType

  element: any | any[]

  // for dynamic data
  props: {
    name?: string
    date?: string // 2024-01-01
    viewType?: ViewType
    [key: string]: any
  }

  /**
   * for editor
   */
  collapsed: boolean

  /**
   * for tree view
   */
  folded: boolean

  children: string[]

  openedAt: Date

  createdAt: Date

  updatedAt: Date
}

export enum FieldType {
  Text = 'Text',
  Number = 'Number',
  Password = 'Password',
  SingleSelect = 'SingleSelect',
  CreatedAt = 'CreatedAt',
  UpdatedAt = 'UpdatedAt',
}

export interface IRootNode extends INode {
  type: NodeType.ROOT
}

export interface IDailyRootNode extends INode {
  type: NodeType.DAILY_ROOT
}

export interface IDatabaseRootNode extends INode {
  type: NodeType.DATABASE_ROOT
}

export interface IDatabaseNode extends INode {
  type: NodeType.DATABASE
  props: {
    name: string // database name, same with tag name
    color: string
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
    optionIds: string[]
    data: any
  }
}

export function isCellNode(node: any): node is ICellNode {
  return node?.type === NodeType.CELL
}

export enum ViewType {
  Table = 'Table',
  List = 'List',
  Calendar = 'Calendar',
  Gallery = 'Gallery',
  Kanban = 'Kanban',
}

export interface IViewNode extends INode {
  parentId: string // should be database id
  type: NodeType.VIEW
  children: string[] // sorted columnIds
  props: {
    name: string
    viewType: ViewType
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

export interface IOptionNode extends INode {
  parentId: string // should be database id
  type: NodeType.OPTION
  props: {
    columnId: string
    name: string
    color: string
  }
}
