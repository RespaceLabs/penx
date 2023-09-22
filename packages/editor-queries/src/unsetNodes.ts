import { Editor, Node, Transforms } from 'slate'
import { SetNodesOptions } from '@penx/editor-types'

export const unsetNodes = <T extends Node = Node>(
  editor: Editor,
  props:
    | keyof Omit<T, 'children' | 'text'>
    | (keyof Omit<T, 'children' | 'text'>)[],
  options: SetNodesOptions = {},
) => {
  return Transforms.unsetNodes<T>(editor, props as any, options as any)
}
