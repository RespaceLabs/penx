export enum NodeType {
  ROOT = 'ROOT',
  COMMON = 'COMMON',
  INBOX = 'INBOX',
  TRASH = 'TRASH',
  DAILY_NOTE = 'DAILY_NOTE',

  TAG_ROOT = 'TAG_ROOT',
  TAG = 'TAG',

  // Database
  DATABASE = 'DATABASE',
  CELL = 'CEL',
  ROW = 'ROW',
  COLUMN = 'COLUMN',
  VIEW = 'VIEW',
  FILTER = 'FILTER',
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
  CreatedBy = 'CreatedBy',
  LastUpdatedBy = 'LastUpdatedBy',
}

export interface IColumnNode extends INode {
  parentId: string // should be database id
  props: {
    databaseId: string
    name: string
    description: string
    fieldType: FieldType
    isPrimary: boolean
    config: any
  }
}

export interface IRowNode extends INode {
  parentId: string // should be database id
  props: {
    databaseId: string
  }
}

export interface ICellNode extends INode {
  parentId: string // should be database id
  props: {
    databaseId: string
    columnId: string
    rowId: string
    fieldType: FieldType
    // options: Option[]
    options: any
  }
}

export interface ICellNode extends INode {
  parentId: string // should be database id
  props: {
    databaseId: string
    columnId: string
    rowId: string
    fieldType: FieldType
    // options: Option[]
    options: any
  }
}
export enum ViewType {
  Grid = 'Grid',
  Calendar = 'Calendar',
  Gallery = 'Gallery',
  Kanban = 'Kanban',
}

export enum LeadingType {
  Short = 'Short',
  Medium = 'Medium',
  Tall = 'Tall',
  ExtraTall = 'ExtraTall',
}

export interface IViewNode extends INode {
  parentId: string // should be database id
  props: {
    databaseId: string
    name: string
    type: ViewType
    stackedColumnId: string
    leading: LeadingType
  }
}

export interface IFilterNode extends INode {
  parentId: string // should be database id
  props: {
    databaseId: string
    columnId: string
    viewId: string
  }
}
