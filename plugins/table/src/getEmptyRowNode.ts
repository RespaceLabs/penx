import { Element } from 'slate'
import { ElementType } from '../custom-types'
import { getEmptyCellNode } from './getEmptyCellNode'

/**
 * Get empty table row node
 * @param colCount column count
 * @param isHeader is table header
 * @returns
 */
export function getEmptyRowNode(colCount: number, isHeader = false): Element {
  return {
    type: ElementType.tr,
    children: Array(colCount)
      .fill(colCount)
      .map(() => getEmptyCellNode(isHeader)),
  } as Element
}
