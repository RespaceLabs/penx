import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

export enum ElementType {
  ul = 'unordered-list', // unordered list
  ol = 'ordered-list', // ordered list
  li = 'list-item', // list item
  lic = 'list-item-text', // list item content
  p = 'p', // list item content
}

export interface ParagraphElement {
  id?: string
  type: ElementType.p
}

export interface ListElement {
  id: string
  type: ElementType.ul | ElementType.ol
}

export interface UnorderedListElement {
  id: string
  type: ElementType.ol
  children: ListItemElement[]
}

export interface OrderedListElement {
  id: string
  type: ElementType.ol
  children: any[]
}

export interface ListItemElement {
  id: string
  type: ElementType.li
  children: any[]
}

export interface ListContentElement {
  id: string
  type: ElementType.lic
}

export type CustomEditor = BaseEditor & ReactEditor

export type CustomElement =
  | ParagraphElement
  | UnorderedListElement
  | OrderedListElement
  | ListElement
  | ListItemElement
  | ListContentElement

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
  }
}
