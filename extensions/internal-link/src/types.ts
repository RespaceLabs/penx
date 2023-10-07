import { BaseElement } from 'slate'

export enum ElementType {
  code_block = 'code_block',
  code_line = 'code_line',
  internal_link_selector = 'internal_link_selector',
  internal_link_content = 'internal_link_content',
}

export interface InternalLinkSelectorElement extends BaseElement {
  id?: string
  type: ElementType.internal_link_selector
  trigger: string
}

export interface InternalLinkContentElement extends BaseElement {
  id?: string
  type: ElementType.internal_link_content
  linkName: string
  linkId: string
}

export interface CodeBlockElement {
  id?: string
  type: ElementType.code_block
  language: string
  highlightingLines?: number[]
  showLineNumbers?: boolean
  title?: string
  children: CodeLineElement[]
}

export interface CodeLineElement {
  id?: string
  type: ElementType.code_line
  children: Record<string, any>[]
}
