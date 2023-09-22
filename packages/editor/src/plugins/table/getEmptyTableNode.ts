import { Element } from 'slate'
import { ElementType } from '@penx/editor-shared'
import { getEmptyRowNode } from './getEmptyRowNode'

export function getEmptyTableNode(rowCount = 3, columnCount = 3): Element {
  return {
    type: ElementType.table,
    colWidths: Array(columnCount).fill(120),
    children: Array(rowCount)
      .fill({})
      .map(() => getEmptyRowNode(columnCount)),
  } as Element
}
