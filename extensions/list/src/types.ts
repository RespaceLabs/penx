import { BaseElement } from 'slate'
import {
  ELEMENT_LI,
  ELEMENT_LIC,
  ELEMENT_OL,
  ELEMENT_TITLE,
  ELEMENT_UL,
} from '@penx/constants'
import { NodeType } from '@penx/model-types'

export interface TitleElement extends BaseElement {
  id?: string
  type: typeof ELEMENT_TITLE
  nodeType?: NodeType
  props: {
    date: string
    color: string
  }
}

export interface ListElement extends BaseElement {
  id: string
  nodeType?: NodeType
  type: typeof ELEMENT_UL | typeof ELEMENT_OL
}

export interface UnorderedListElement extends BaseElement {
  id: string
  type: typeof ELEMENT_UL
  nodeType?: NodeType
  children: ListItemElement[]
}

export interface OrderedListElement extends BaseElement {
  id: string
  type: typeof ELEMENT_OL
  nodeType?: NodeType
  children: any[]
}

export interface ListItemElement extends BaseElement {
  id: string
  type: typeof ELEMENT_LI
  nodeType?: NodeType
  children: (UnorderedListElement | ListContentElement)[] // [lic | ul]
}

export interface ListContentElement extends BaseElement {
  id: string
  type: typeof ELEMENT_LIC
  nodeType?: NodeType
  collapsed: boolean
}
