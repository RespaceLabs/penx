import { Editor, Node, Path } from 'slate'
import { ReactEditor } from 'slate-react'

/**
 * @see {@link ReactEditor.findPath}
 */
export const findNodePath = (editor: Editor, node: Node): Path | undefined => {
  try {
    return ReactEditor.findPath(editor as any, node)
  } catch (e) {}
}
