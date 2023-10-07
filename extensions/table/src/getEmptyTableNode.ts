import { Element } from 'slate'
import { getEmptyRowNode } from './getEmptyRowNode'
import { ElementType } from './types'

export function getEmptyTableNode(rowCount = 3, columnCount = 3): Element {
  return {
    type: ElementType.table,
    colWidths: Array(columnCount).fill(120),
    children: Array(rowCount)
      .fill({})
      .map(() => getEmptyRowNode(columnCount)),
  } as Element
}
