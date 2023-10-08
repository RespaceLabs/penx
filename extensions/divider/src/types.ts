import { BaseElement } from 'slate'

export const ELEMENT_HR = 'hr'

export interface DividerElement extends BaseElement {
  type: typeof ELEMENT_HR
  id: string
}
