import { Element } from 'slate'
import { ELEMENT_TD, ELEMENT_TH } from '@penx/constants'
import { getEmptyParagraph } from '@penx/paragraph'

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
