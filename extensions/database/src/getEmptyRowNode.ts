import { Element } from 'slate'
import { getEmptyCellNode } from './getEmptyCellNode'
import { ELEMENT_TR } from './types'

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
