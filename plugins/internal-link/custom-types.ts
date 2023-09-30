import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

export enum ElementType {
  internal_link_selector = 'internal_link_selector',
  internal_link_content = 'internal_link_content',
}

export interface InternalLinkSelectorElement {
  id?: string
  type: ElementType.internal_link_selector
  trigger: string
}

export interface InternalLinkContentElement {
  id?: string
  type: ElementType.internal_link_content
  linkName: string
  linkId: string
  children?: any[]
}

export type CustomEditor = BaseEditor &
  ReactEditor & {
    id?: string
  }

export type CustomElement =
  | InternalLinkSelectorElement
  | InternalLinkContentElement

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
  }
}
