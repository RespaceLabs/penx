import { BaseEditor, Element, Range } from 'slate'
import { HistoryEditor } from 'slate-history'
import { ReactEditor } from 'slate-react'
import { BlockElement, OnKeyDown } from '@penx/plugin-typings'

export type CustomEditor = BaseEditor &
  ReactEditor &
  HistoryEditor & {
    children: Element[]
    elementMaps: Record<string, BlockElement>
    onKeyDownFns: OnKeyDown[]
    nodeToDecorations: Map<Element, Range[]>
  }

type CustomText = {
  text: string

  selected?: boolean

  id?: string
  type?: any

  bold?: true
  italic?: true
  underline?: true

  /**
   * is inline code
   */
  code?: true

  strike_through?: true
  highlight?: true
  subscript?: true
  superscript?: true
  language?: string
}

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor & {
      type?: string
      id?: string
      selected?: boolean
    }
    Text: CustomText
  }
}
