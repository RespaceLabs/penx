import { ELEMENT_P } from '@/lib/constants'
import { ParagraphElement } from './types'

export const getEmptyParagraph = (text = '') => {
  return {
    type: ELEMENT_P,
    children: [{ text }],
  } as ParagraphElement
}
