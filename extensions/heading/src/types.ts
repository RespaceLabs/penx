import { BaseElement } from 'slate'

export const ELEMENT_H1 = 'h1'
export const ELEMENT_H2 = 'h2'
export const ELEMENT_H3 = 'h3'
export const ELEMENT_H4 = 'h4'
export const ELEMENT_H5 = 'h5'
export const ELEMENT_H6 = 'h6'

interface BaseCustomElement extends BaseElement {
  id: string
}

export interface H1Element extends BaseCustomElement {
  type: typeof ELEMENT_H1
}

export interface H2Element extends BaseCustomElement {
  type: typeof ELEMENT_H2
}

export interface H3Element extends BaseCustomElement {
  type: typeof ELEMENT_H3
}

export interface H4Element extends BaseCustomElement {
  type: typeof ELEMENT_H4
}

export interface H5Element extends BaseCustomElement {
  type: typeof ELEMENT_H5
}

export interface H6Element extends BaseCustomElement {
  type: typeof ELEMENT_H6
}

export type HeadingElement =
  | H1Element
  | H2Element
  | H3Element
  | H4Element
  | H5Element
  | H6Element
