import { Element } from 'slate'
import { getEmptyParagraph } from '@penx/paragraph'
import { ElementType } from './types'

/**
 * get empty cell node
 * @param isHeader is th
 * @returns
 */
export function getEmptyCellNode(isHeader = false): Element {
  return {
    type: isHeader ? ElementType.th : ElementType.td,
    children: [getEmptyParagraph()],
  } as Element
}
