import { ELEMENT_CODE_BLOCK, ELEMENT_CODE_LINE } from '@penx/constants'
import { CodeBlockElement, CodeLineElement } from './types'

export function isCodeBlock(node: any): node is CodeBlockElement {
  return (node as CodeBlockElement).type === ELEMENT_CODE_BLOCK
}

export function isCodeLine(node: any): node is CodeLineElement {
  return (node as CodeLineElement).type === ELEMENT_CODE_LINE
}
