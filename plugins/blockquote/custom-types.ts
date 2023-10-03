import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

export enum ElementType {
  blockquote = 'blockquote',
}

export type CustomEditor = BaseEditor & ReactEditor

export interface BlockquoteElement {
  id?: string
  type: ElementType.blockquote
  children?: any[]
}

export type CustomElement = BlockquoteElement

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
  }
}
