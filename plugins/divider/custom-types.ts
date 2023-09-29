import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

export type CustomEditor = BaseEditor & ReactEditor

export interface DividerElement {
  type: 'h1'
  id: string
}

export type CustomElement = DividerElement

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
  }
}
