import { ELEMENT_P } from '@/lib/constants'
import { ParagraphElement } from './types'

export function isParagraph(node: any): node is ParagraphElement {
  return node?.type === ELEMENT_P
}
