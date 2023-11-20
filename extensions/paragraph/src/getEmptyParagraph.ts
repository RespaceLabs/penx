import { ELEMENT_P } from '@penx/constants'
import { ParagraphElement } from './types'

export const getEmptyParagraph = (text = '') => {
  return {
    type: ELEMENT_P,
    children: [{ text }],
  } as ParagraphElement
}
