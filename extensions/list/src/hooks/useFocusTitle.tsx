import { useEffect } from 'react'
import { Editor, Node, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import { useEditorStatic } from '@penx/editor-common'
import { TitleElement } from '../types'

export const useFocusTitle = (element: TitleElement) => {
  const editor = useEditorStatic()
  const titleStr = Node.string(element)
  const onlyHasTitle = editor.children.length === 1
  const firstLineNode = editor.children[1]
  const firstLineStr = firstLineNode ? Node.string(firstLineNode) : ''

  // TODO: have bugs
  useEffect(() => {
    // focus on title
    if (onlyHasTitle || !titleStr) {
      setTimeout(() => {
        Transforms.select(editor, Editor.end(editor, [0, 0]))
        ReactEditor.focus(editor)
      }, 0)
    }

    // focus to the first line
    if (titleStr && firstLineNode && !firstLineStr) {
      setTimeout(() => {
        // Transforms.select(editor, Editor.end(editor, [1]))
        // ReactEditor.focus(editor)
      }, 0)
    }
  }, [onlyHasTitle, editor, titleStr, firstLineStr, firstLineNode])
}
