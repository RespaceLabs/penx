import { BaseEditor, BaseElement } from 'slate'
import { ReactEditor } from 'slate-react'
import { BlockElement } from '@penx/plugin-typings'

export enum ElementType {
  block_selector = 'block_selector',
  code_block = 'code_block',
  code_line = 'code_line',
}

export type CustomEditor = BaseEditor &
  ReactEditor & {
    id?: string
    type?: string
    elementMaps: Record<string, BlockElement>
  }

export interface BlockSelectorElement extends BaseElement {
  id?: string
  type: ElementType.block_selector
  trigger: string
}

// export type CustomElement = BlockSelectorElement

// declare module 'slate' {
//   interface CustomTypes {
//     Editor: CustomEditor
//     Element: CustomElement
//   }
// }
