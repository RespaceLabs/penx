import { Element, Node } from 'slate'
import { BlockSelectorElement, ElementType } from '../custom-types'

export function isBlockSelector(node: any): node is BlockSelectorElement {
  return node.type === ElementType.block_selector
}
