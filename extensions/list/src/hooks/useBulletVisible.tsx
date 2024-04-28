import { useEffect, useState } from 'react'
import { Editor, Node } from 'slate'
import { useFocused } from 'slate-react'
import { useEditor, useEditorStatic } from '@penx/editor-common'
import { findNodePath } from '@penx/editor-queries'
import { EditorMode, NodeType } from '@penx/model-types'
import { store } from '@penx/store'
import { emitter } from '../emitter'
import { listSchema } from '../listSchema'
import { ListContentElement } from '../types'

/**
 * Should bullet be visible?
 * @param element
 * @returns
 */
export const useBulletVisible = (element: ListContentElement) => {
  // const editor = useEditor()
  const editor = useEditorStatic()

  const path = findNodePath(editor, element)
  // console.log('=========element:', element)

  const [isFocused, setFocused] = useState(false)

  useEffect(() => {
    emitter.on('ON_SELECT', (id) => {
      if (id === element.id) {
        setFocused(true)
      } else {
        setFocused(false)
      }
    })
    return () => {
      emitter.off('ON_SELECT')
    }
  }, [])

  const isFirstLine = path?.[1] === 0
  const str = Node.string(element)

  const isBulletVisible = !!str || isFocused || isFirstLine
  const activeSpace = store.space.getActiveSpace()

  if (
    (element as any)?.nodeType === NodeType.DAILY &&
    activeSpace.editorMode === EditorMode.BLOCK
  ) {
    return { isBulletVisible: true, isFocus: isFocused }
  }

  return { isBulletVisible, isFocus: isFocused }
}
