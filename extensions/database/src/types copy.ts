import { BaseElement } from 'slate'
import { ELEMENT_TAG, ELEMENT_TAG_SELECTOR } from '@penx/constants'

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
