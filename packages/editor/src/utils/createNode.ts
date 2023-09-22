import { Element } from 'slate'
import { ElementType } from '@penx/editor-shared'

export const createNode = (type: any = ElementType.p, text = ''): Element => ({
  type,
  children: [{ text }],
})
