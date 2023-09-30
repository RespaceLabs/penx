import { BaseEditor, BaseElement } from 'slate'
import { ReactEditor } from 'slate-react'

export enum ElementType {
  table = 'table',
  tr = 'tr',
  td = 'td',
  th = 'th',
}

export interface BaseCustomElement extends BaseElement {
  id?: string
}

export interface TableElement extends BaseCustomElement {
  type: ElementType.table
  colWidths: number[] // table col widths
  isHeaderRow: boolean
  isHeaderColumn: boolean
  children: TableRowElement[]
}

export interface TableRowElement extends BaseCustomElement {
  type: ElementType.tr
  children: TableCellElement[]
}

export interface TableCellElement extends BaseCustomElement {
  type: ElementType.td
}

export type CustomEditor = BaseEditor &
  ReactEditor & {
    id?: string
  }

export type CustomElement = TableElement | TableRowElement | TableCellElement

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
  }
}
