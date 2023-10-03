import { BaseEditor, Descendant, Element, Range, Text } from 'slate'
import { ReactEditor } from 'slate-react'

export enum ElementType {
  code_block = 'code_block',
  code_line = 'code_line',
  p = 'p',
}

export type CustomEditor = BaseEditor &
  ReactEditor & {
    nodeToDecorations: Map<Element, Range[]>
  }

export interface ParagraphElement {
  id?: string
  type: ElementType.p
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

export type CustomElement =
  | CodeBlockElement
  | CodeLineElement
  | ParagraphElement

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
  }
}
