import { Editor, Node, Transforms } from 'slate'
import { SetNodesOptions } from '@penx/editor-types'

export const setNodes = <T extends Node = Node>(
  editor: Editor,
  props: Partial<T>,
  options?: SetNodesOptions,
) => Transforms.setNodes<T>(editor, props, options)
