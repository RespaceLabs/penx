import { BaseEditor, BaseElement, Editor, Element } from 'slate'
import { ReactEditor } from 'slate-react'

export type CustomEditor = BaseEditor & ReactEditor

interface BaseCustomElement {
  id: string
}

export interface H1Element extends BaseCustomElement {
  type: 'h1'
}

export interface H2Element extends BaseCustomElement {
  type: 'h2'
}

export interface H3Element extends BaseCustomElement {
  type: 'h3'
}

export interface H4Element extends BaseCustomElement {
  type: 'h4'
}

export interface H5Element extends BaseCustomElement {
  type: 'h5'
}

export interface H6Element extends BaseCustomElement {
  type: 'h6'
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
