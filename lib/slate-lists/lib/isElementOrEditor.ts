import type { Editor, Element, Node } from 'slate'

/**
 * The Slate's `Element.isElement()` is explicitly excluding `Editor`.
 */
export function isElementOrEditor(node: Node): node is Element | Editor {
  return 'children' in node
}
