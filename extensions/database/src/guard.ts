import {
  DatabaseElement,
  ELEMENT_DATABASE,
  ELEMENT_TD,
  ELEMENT_TR,
  TableCellElement,
  TableRowElement,
} from './types'

export function isTable(node: any): node is DatabaseElement {
  return node?.type === ELEMENT_DATABASE
}

export function isTableRow(node: any): node is TableRowElement {
  return node.type === ELEMENT_TR
}

export function isTableCell(node: any): node is TableCellElement {
  return node.type === ELEMENT_TD
}
