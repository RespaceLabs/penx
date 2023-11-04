import { Element } from 'slate'
import { getEmptyRowNode } from './getEmptyRowNode'
import { ELEMENT_DATABASE } from './types'

export function getEmptyTableNode(rowCount = 2, columnCount = 2): Element {
  return {
    type: ELEMENT_DATABASE,
    colWidths: Array(columnCount).fill(120),
    children: Array(rowCount)
      .fill({})
      .map(() => getEmptyRowNode(columnCount)),
  } as Element
}
