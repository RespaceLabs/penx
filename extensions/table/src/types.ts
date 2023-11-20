import { BaseElement } from 'slate'
import { ELEMENT_TABLE, ELEMENT_TD, ELEMENT_TR } from '@penx/constants'

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
