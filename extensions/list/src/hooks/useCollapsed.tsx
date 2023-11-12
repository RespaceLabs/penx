import { useMemo } from 'react'
import { Path } from 'slate'
import { useEditor } from '@penx/editor-common'
import { findNodePath, getNodeByPath } from '@penx/editor-queries'
import { isListContentElement } from '../guard'
import { ListElement } from '../types'

export const useCollapsed = (element: ListElement) => {
  const editor = useEditor()
  const path = findNodePath(editor, element)!

  const collapsed = useMemo(() => {
    if (path.length === 1) return false
    const prevPath = Path.previous(path)
    const node = getNodeByPath(editor, prevPath)!
    if (isListContentElement(node)) return node.collapsed
    return false
  }, [path, editor])

  return collapsed
}
