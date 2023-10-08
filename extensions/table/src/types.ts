import { BaseElement } from 'slate'

export const ELEMENT_TABLE = 'table'
export const ELEMENT_TR = 'tr'
export const ELEMENT_TD = 'td'
export const ELEMENT_TH = 'th'

export interface BaseCustomElement extends BaseElement {
  id?: string
}

export interface TableElement extends BaseCustomElement {
  type: typeof ELEMENT_TABLE
  colWidths: number[] // table col widths
  isHeaderRow: boolean
  isHeaderColumn: boolean
  children: TableRowElement[]
}

export interface TableRowElement extends BaseCustomElement {
  type: typeof ELEMENT_TR
  children: TableCellElement[]
}

export interface TableCellElement extends BaseCustomElement {
  type: typeof ELEMENT_TD
}
