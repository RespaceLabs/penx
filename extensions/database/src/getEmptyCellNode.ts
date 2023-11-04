import { Element } from 'slate'
import { getEmptyParagraph } from '@penx/paragraph'
import { ELEMENT_TD, ELEMENT_TH } from './types'

/**
 * get empty cell node
 * @param isHeader is th
 * @returns
 */
export function getEmptyCellNode(isHeader = false): Element {
  return {
    type: isHeader ? ELEMENT_TH : ELEMENT_TD,
    children: [getEmptyParagraph()],
  } as Element
}
