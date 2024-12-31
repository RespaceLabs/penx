import type { TElement } from '@udecode/plate-common'

export interface TTagItemBase {
  text: string
  key?: any
}

export interface TTagInputElement extends TElement {
  trigger: string
}

export interface TTagElement extends TElement {
  value: string
}
