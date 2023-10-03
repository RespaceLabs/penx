import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

export type CustomEditor = BaseEditor & ReactEditor

export enum ElementType {
  hr = 'hr',
}

export interface DividerElement {
  type: ElementType.hr
  id: string
}

export type CustomElement = DividerElement

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
  }
}
