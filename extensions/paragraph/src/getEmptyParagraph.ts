import { ELEMENT_P, ParagraphElement } from './types'

export const getEmptyParagraph = (text = '') => {
  return {
    type: ELEMENT_P,
    children: [{ text }],
  } as ParagraphElement
}
