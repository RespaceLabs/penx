import { ELEMENT_BLOCK_SELECTOR } from '@penx/constants'
import { BlockSelectorElement } from './types'

export function isBlockSelector(node: any): node is BlockSelectorElement {
  return node?.type === ELEMENT_BLOCK_SELECTOR
}
