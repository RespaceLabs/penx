import { Editor, Element } from 'slate'
import { getNodeByPath } from '.'
import { getCurrentPath } from './getCurrentPath'

export function getCurrentNode(editor: Editor): Element | null {
  const path = getCurrentPath(editor)
  if (!path) return null
  return getNodeByPath<Element>(editor, path.slice(0, -1))
}
