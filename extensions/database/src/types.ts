import { BaseElement } from 'slate'
import {
  ELEMENT_DAILY_ENTRY,
  ELEMENT_DATABASE,
  ELEMENT_DATABASE_CONTAINER,
  ELEMENT_DATABASE_ENTRY,
  ELEMENT_LIVE_QUERY,
  ELEMENT_TAG,
  ELEMENT_TAG_SELECTOR,
} from '@penx/constants'

export interface BaseCustomElement extends BaseElement {
  id?: string
}

export interface DatabaseEntryElement extends BaseCustomElement {
  type: typeof ELEMENT_DATABASE_ENTRY
  databaseId: string
  name: string
  props: {
    color: string
    name: string
  }
}

export interface DatabaseContainerElement extends BaseCustomElement {
  type: typeof ELEMENT_DATABASE_CONTAINER
  databaseId: string
  maxHeight: number
}

export interface DatabaseElement extends BaseCustomElement {
  type: typeof ELEMENT_DATABASE
  databaseId: string
  name: string
}

export interface DailyEntryElement extends BaseCustomElement {
  type: typeof ELEMENT_DAILY_ENTRY
  props: {
    date: string
  }
}

export interface LiveQueryElement extends BaseCustomElement {
  type: typeof ELEMENT_LIVE_QUERY
}

export interface TagSelectorElement extends BaseElement {
  id?: string
  type: typeof ELEMENT_TAG_SELECTOR
  isOpen: boolean
  trigger: string
  tagId: string
}

export interface TagElement extends BaseElement {
  id?: string
  type: typeof ELEMENT_TAG
  trigger: string
  name: string
  databaseId: string
}
