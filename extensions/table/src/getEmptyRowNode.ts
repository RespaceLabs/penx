import { Element } from 'slate'
import { ELEMENT_TR } from '@penx/constants'
import { getEmptyCellNode } from './getEmptyCellNode'

/**
 * Get empty table row node
 * @param colCount column count
 * @param isHeader is table header
 * @returns
 */
export function getEmptyRowNode(colCount: number, isHeader = false): Element {
  return {
    type: ELEMENT_TR,
    children: Array(colCount)
      .fill(colCount)
      .map(() => getEmptyCellNode(isHeader)),
  } as Element
}
