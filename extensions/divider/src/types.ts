import { BaseElement } from 'slate'

export enum ElementType {
  hr = 'hr',
}

export interface DividerElement extends BaseElement {
  type: ElementType.hr
  id: string
}
