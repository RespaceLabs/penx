import { ELEMENT_P, ParagraphElement } from './types'

export function isParagraph(node: any): node is ParagraphElement {
  return node?.type === ELEMENT_P
}
