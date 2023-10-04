import { Element, Node } from 'slate'
import { CodeBlockElement, CodeLineElement, ElementType } from './types'

export function isCodeBlock(node: any): node is CodeBlockElement {
  return (node as CodeBlockElement).type === ElementType.code_block
}

export function isCodeLine(node: any): node is CodeLineElement {
  return (node as CodeLineElement).type === ElementType.code_line
}
