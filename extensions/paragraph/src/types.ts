import { BaseElement } from 'slate'

export enum ElementType {
  p = 'p',
}

export interface ParagraphElement extends BaseElement {
  id?: string
  type: ElementType.p
}
