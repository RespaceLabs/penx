import { Editor, Node } from 'slate'
import { useEditor } from '@penx/editor-common'
import { findNodePath } from '@penx/editor-queries'
import { listSchema } from '../listSchema'
import { ListContentElement } from '../types'

/**
 * Should bullet be visible?
 * @param element
 * @returns
 */
export const useBulletVisible = (element: ListContentElement) => {
  const editor = useEditor()
  const currentElement = (() => {
    if (!editor.selection) return null
    const res = Editor.nodes(editor, {
      mode: 'lowest',
      at: editor.selection,
      match: listSchema.isListItemTextNode,
    })

    const licEntries = Array.from(res)
    if (!licEntries.length) return null
    return licEntries[0][0]
  })()

  const path = findNodePath(editor, element)

  const isFirstLine = path?.[1] === 0
  const str = Node.string(element)
  const isFocused = currentElement === element
  const isBulletVisible = !!str || isFocused || isFirstLine

  return isBulletVisible
}
