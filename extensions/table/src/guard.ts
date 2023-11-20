import { ELEMENT_TABLE, ELEMENT_TD, ELEMENT_TR } from '@penx/constants'
import { TableCellElement, TableElement, TableRowElement } from './types'

export function isTable(node: any): node is TableElement {
  return node?.type === ELEMENT_TABLE
}

export function isTableRow(node: any): node is TableRowElement {
  return node?.type === ELEMENT_TR
}

export function isTableCell(node: any): node is TableCellElement {
  return node?.type === ELEMENT_TD
}
