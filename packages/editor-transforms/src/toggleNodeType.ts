import { Editor, Element } from 'slate'
import { someNode } from '@penx/editor-queries'
import { ElementType } from '@penx/editor-shared'
import { EditorNodesOptions } from '@penx/editor-types'
import { setNodes } from './setNodes'

export interface ToggleNodeTypeOptions {
  /**
   * If there is no node type above the selection, set the selected node type to activeType.
   */
  activeType?: string

  /**
   * If there is a node type above the selection, set the selected node type to inactiveType.
   */
  inactiveType?: string
}

/**
 * Toggle the type of the selected node.
 * Don't do anything if activeType === inactiveType.
 */
export const toggleNodeType = (
  editor: Editor,
  options: ToggleNodeTypeOptions,
  editorNodesOptions?: Omit<EditorNodesOptions, 'match'>,
) => {
  const { activeType, inactiveType = ElementType.p } = options

  if (!activeType || !editor.selection) return

  const isActive = someNode(editor, {
    ...editorNodesOptions,
    match: {
      type: activeType,
    },
  })

  if (isActive && activeType === inactiveType) return

  setNodes(editor, {
    type: isActive ? inactiveType : activeType,
  })
}
