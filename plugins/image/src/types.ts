import { BaseElement } from 'slate'

export enum ElementType {
  img = 'img',
}

export interface ImageElement extends BaseElement {
  id?: string
  type: ElementType.img
  url: string
  width: number // image width
}
