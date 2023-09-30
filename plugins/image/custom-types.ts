import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

export enum ElementType {
  img = 'img',
}

export type CustomEditor = BaseEditor &
  ReactEditor & {
    id?: string
  }

export interface ImageElement {
  id?: string
  type: ElementType.img
  url: string
  width: number // image width
  // children: CustomText[]
}

export type CustomElement = ImageElement

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
  }
}
