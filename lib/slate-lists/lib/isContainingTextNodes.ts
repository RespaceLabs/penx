import type { Element } from 'slate'
import { Text } from 'slate'

export function isContainingTextNodes(element: Element): boolean {
  return !!element.children?.some(Text.isText)
}
