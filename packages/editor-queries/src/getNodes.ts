import { Editor, Node } from 'slate'
import { EditorNodesOptions } from '@penx/editor-types'
import { getQueryOptions } from './match'

export const getNodes = <T extends Node>(
  editor: Editor,
  options: EditorNodesOptions = {},
) => {
  return Editor.nodes<T>(editor, getQueryOptions(editor, options))
}
