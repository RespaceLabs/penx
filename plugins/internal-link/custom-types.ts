import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

export enum ElementType {
  code_block = 'code_block',
  code_line = 'code_line',
  internal_link_selector = 'internal_link_selector',
  internal_link_content = 'internal_link_content',
}

export interface InternalLinkSelectorElement {
  id?: string
  type: ElementType.internal_link_selector
  trigger: string
  children?: any[]
}

export interface InternalLinkContentElement {
  id?: string
  type: ElementType.internal_link_content
  linkName: string
  linkId: string
  children?: any[]
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

export type CustomEditor = BaseEditor &
  ReactEditor & {
    id?: string
  }

export type CustomElement =
  | InternalLinkSelectorElement
  | InternalLinkContentElement
  | CodeBlockElement
  | CodeLineElement

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
  }
}
