import { BaseEditor, BaseElement } from 'slate'
import { ReactEditor } from 'slate-react'

export enum ElementType {
  code_block = 'code_block',
  block_selector = 'block_selector',
}

export type CustomEditor = BaseEditor &
  ReactEditor & {
    id?: string
    type?: string
    elementMaps: Record<string, any>
  }

export interface BlockSelectorElement extends BaseElement {
  id?: string
  type: ElementType.block_selector
  trigger: string
}

export type CustomElement = BlockSelectorElement

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
  }
}
