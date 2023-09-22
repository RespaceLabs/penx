import { Ancestor, Editor, Location, Node, NodeEntry } from 'slate'
import { findNodePath } from './findNodePath'

/**
 * See {@link Editor.parent}.
 * Returns undefined if there is no parent.
 */
export const getParentByElement = (
  editor: Editor,
  node: Node,
): NodeEntry | undefined => {
  try {
    const parentPath = findNodePath(editor, node)!
    return Editor.parent(editor, parentPath?.slice(0, -1)) as NodeEntry
  } catch (err) {}
}
