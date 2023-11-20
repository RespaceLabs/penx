import { ELEMENT_P } from '@penx/constants'
import { ParagraphElement } from './types'

export function isParagraph(node: any): node is ParagraphElement {
  return node?.type === ELEMENT_P
}
