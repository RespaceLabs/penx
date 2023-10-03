import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

export type CustomEditor = BaseEditor & ReactEditor

export enum ElementType {
  p = 'p',
}

export interface ParagraphElement {
  id?: string
  type: ElementType.p
}

export type CustomElement = ParagraphElement

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
  }
}
