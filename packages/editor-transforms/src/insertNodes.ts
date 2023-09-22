import { Editor, Node, Transforms } from 'slate'
import { InsertNodesOptions } from '@penx/editor-types'

export const insertNodes = <
  T extends Node = Node,
  TNodeMatch extends Node = Node,
>(
  editor: Editor,
  props: T | T[],
  options?: InsertNodesOptions,
) => Transforms.insertNodes<TNodeMatch>(editor, props, options as any)
