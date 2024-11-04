import { Element, Text } from 'slate'
import { AnyObject } from '../utility/AnyObject'
import { isElement } from './TElement'
import { isText } from './TText'

export type TDescendant = Element | Text

export const isDescendant: (value: any) => value is TDescendant = ((
  node: any,
) => isElement(node) || isText(node)) as any
