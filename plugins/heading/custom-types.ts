import { BaseEditor, BaseElement, Editor, Element } from 'slate'
import { ReactEditor } from 'slate-react'

export enum ElementType {
  h1 = 'h1',
  h2 = 'h2',
  h3 = 'h3',
  h4 = 'h4',
  h5 = 'h5',
  h6 = 'h6',
}

export type CustomEditor = BaseEditor & ReactEditor

interface BaseCustomElement {
  id: string
}

export interface H1Element extends BaseCustomElement {
  type: ElementType.h1
}

export interface H2Element extends BaseCustomElement {
  type: ElementType.h2
}

export interface H3Element extends BaseCustomElement {
  type: ElementType.h3
}

export interface H4Element extends BaseCustomElement {
  type: ElementType.h4
}

export interface H5Element extends BaseCustomElement {
  type: ElementType.h5
}

export interface H6Element extends BaseCustomElement {
  type: ElementType.h6
}

export type CustomElement =
  | H1Element
  | H2Element
  | H3Element
  | H4Element
  | H5Element
  | H6Element

type CustomText = {
  text: string
}

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor & {
      type?: string
      id?: string
      selected?: boolean
    }
    Element: CustomElement
    Text: CustomText
  }
}
