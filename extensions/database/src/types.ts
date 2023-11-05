import { BaseElement } from 'slate'
import { ELEMENT_DATABASE } from './constants'

export interface BaseCustomElement extends BaseElement {
  id?: string
}

export interface DatabaseElement extends BaseCustomElement {
  type: typeof ELEMENT_DATABASE
  databaseId: string
  name: string
}

export interface NodeQueryElement extends BaseCustomElement {
  type: typeof ELEMENT_DATABASE
  colWidths: number[] // table col widths
  isHeaderRow: boolean
  isHeaderColumn: boolean
  databaseId: string
}
