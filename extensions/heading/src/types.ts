import { BaseElement } from 'slate'
import {
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
} from '@penx/constants'

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
