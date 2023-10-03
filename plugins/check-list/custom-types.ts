import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

export enum ElementType {
  check_list_item = 'check_list_item',
}

export type CustomEditor = BaseEditor & ReactEditor

export interface CheckListItemElement {
  id: string
  type: ElementType.check_list_item
  checked: boolean
}

export type CustomElement = CheckListItemElement

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
  }
}
