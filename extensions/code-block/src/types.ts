import { BaseElement } from 'slate'

export enum ElementType {
  code_block = 'code_block',
  code_line = 'code_line',
  p = 'p',
}

export interface CodeBlockElement extends BaseElement {
  id?: string
  type: ElementType.code_block
  language: string
  highlightingLines?: number[]
  showLineNumbers?: boolean
  title?: string
}

export interface CodeLineElement extends BaseElement {
  id?: string
  type: ElementType.code_line
}
