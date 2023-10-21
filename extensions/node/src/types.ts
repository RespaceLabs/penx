import { BaseElement } from 'slate'
import { ELEMENT_NODE } from './constants'

export interface NodeElement extends BaseElement {
  id?: string
  type: typeof ELEMENT_NODE
}
