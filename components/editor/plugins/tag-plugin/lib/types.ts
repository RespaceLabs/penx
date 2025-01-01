import type { TElement } from '@udecode/plate-common'

export interface TTagItemBase {
  text: string
  key?: any
  color: string
  element: any
  databaseId: string
  recordId?: any
}

export interface TTagInputElement extends TElement {
  trigger: string
}

export interface TTagElement extends TElement {
  value: string
  color: string
  databaseId: string
  recordId?: any
}
