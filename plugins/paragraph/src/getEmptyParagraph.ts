import { ElementType, ParagraphElement } from './types'

export const getEmptyParagraph = () => {
  return {
    type: ElementType.p,
    children: [{ text: '' }],
  } as ParagraphElement
}
