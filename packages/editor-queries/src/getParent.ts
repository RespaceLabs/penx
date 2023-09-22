import { Ancestor, Editor, Location, NodeEntry } from 'slate'
import { EditorParentOptions } from '@penx/editor-types'

/**
 * See {@link Editor.parent}.
 * Returns undefined if there is no parent.
 */
export const getParent = <T extends Ancestor = Ancestor>(
  editor: Editor,
  at: Location,
  options?: EditorParentOptions,
): NodeEntry<T> | undefined => {
  try {
    return Editor.parent(editor, at, options) as NodeEntry<T> | undefined
  } catch (err) {}
}
