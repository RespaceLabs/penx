import { Editor, Element, Node, Transforms } from 'slate'
import { WrapOptions } from '@penx/editor-types'
import { unhangRange, UnhangRangeOptions } from './unhangRange'

/**
 * {@link Transforms.wrapNodes}.
 */
export const wrapNodes = <
  T extends Element = Element,
  TNodeMatch extends Node = Node,
>(
  editor: Editor,
  element: T,
  options: WrapOptions<TNodeMatch> & UnhangRangeOptions = {},
) => {
  unhangRange(editor, options)

  Transforms.wrapNodes<TNodeMatch>(editor, element as any, options as any)
}
