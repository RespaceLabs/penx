import { isAncestor } from '@/lib/editor-types'
import { Descendant, Editor, Node, NodeEntry } from 'slate'

const getLastChild = (node: Node, level: number): Descendant => {
  if (!(level + 1) || !isAncestor(node)) return node as any

  const { children } = node

  const lastNode = children?.[children.length - 1]

  return getLastChild(lastNode, level - 1)
}

/**
 * Get the last node at a given level.
 */
export const getLastNode = (
  editor: Editor,
  level: number,
): NodeEntry<Descendant> | undefined => {
  const { children } = editor

  const lastNode = children[children.length - 1]

  if (!lastNode) return

  const [, lastPath] = Editor.last(editor, [])

  return [getLastChild(lastNode, level - 1), lastPath.slice(0, level + 1)]
}
