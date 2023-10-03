import { Element, Node } from 'slate'
import { BlockSelectorElement, ElementType } from '../custom-types'

export function isBlockSelector(node: Node): node is BlockSelectorElement {
  return (node as Element).type === ElementType.block_selector
}
