import { Element } from 'slate'
import { ELEMENT_TABLE } from '@penx/constants'
import { getEmptyRowNode } from './getEmptyRowNode'

export function getEmptyTableNode(rowCount = 3, columnCount = 3): Element {
  return {
    type: ELEMENT_TABLE,
    colWidths: Array(columnCount).fill(120),
    children: Array(rowCount)
      .fill({})
      .map(() => getEmptyRowNode(columnCount)),
  } as Element
}
