import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

export enum ElementType {
  link = 'a',
}

export type CustomEditor = BaseEditor &
  ReactEditor & {
    id?: string
  }

export interface LinkElement {
  id?: string
  type: ElementType.link
  url: string
  children?: any[]
}

export type CustomElement = LinkElement

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
  }
}
