import { Element } from 'slate'
import { ElementType } from '@penx/editor-shared'

/**
 * get empty cell node
 * @param isHeader is th
 * @returns
 */
export function getEmptyCellNode(isHeader = false): Element {
  return {
    type: isHeader ? ElementType.th : ElementType.td,
    children: [
      {
        type: ElementType.p,
        children: [{ text: '' }],
      },
    ],
  } as Element
}
