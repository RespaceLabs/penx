import { Element } from 'slate'
import { ElementType } from '@penx/editor-shared'

/**
 * get empty box, default empty p
 * @returns
 */
export function getEmptyBox(): Element {
  return {
    type: ElementType.container,
    children: [
      {
        type: ElementType.p,
        children: [{ text: '' }],
      },
    ],
  } as any
}
