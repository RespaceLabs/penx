import {
  ElementType,
  TableCellElement,
  TableElement,
  TableRowElement,
} from './types'

export function isTable(node: any): node is TableElement {
  return node?.type === ElementType.table
}

export function isTableRow(node: any): node is TableRowElement {
  return node.type === ElementType.tr
}

export function isTableCell(node: any): node is TableCellElement {
  return node.type === ElementType.td
}
