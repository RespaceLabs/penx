import { BaseElement } from 'slate'
import { ELEMENT_HR } from '@penx/constants'

export interface DividerElement extends BaseElement {
  type: typeof ELEMENT_HR
  id: string
}

export function isDivider(node: any): node is DividerElement {
  return node?.type === ELEMENT_HR
}
