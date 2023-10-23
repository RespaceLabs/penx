import { BaseElement } from 'slate'

export const ELEMENT_TITLE = 'title'

export interface TitleElement extends BaseElement {
  id?: string
  type: typeof ELEMENT_TITLE
}
