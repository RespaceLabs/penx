import { Ancestor, Editor } from 'slate'
import { TEditor } from '..'
import { AnyObject } from '../utility/AnyObject'
import { isElement, TElement } from './TElement'

export type TAncestor<TExtension = AnyObject> =
  | TEditor<TExtension>
  | TElement<TExtension>

export const isAncestor: (value: any) => value is Ancestor = ((node: any) =>
  Editor.isEditor(node) || isElement(node)) as any
