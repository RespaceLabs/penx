import { KeyboardEvent, useEffect } from 'react'
import { Descendant, Editor, Transforms } from 'slate'
import { ReactEditor, Slate } from 'slate-react'
import { EditableProps } from 'slate-react/dist/components/editable'
import { SetNodeToDecorations } from '@penx/code-block'
import { PenxEditor } from '@penx/editor-common'
import { getNodeByPath } from '@penx/editor-queries'
import { useCreateEditor } from '../hooks/useCreateEditor'
import { NodeEditorEditable } from './NodeEditorEditable'

interface Props {
  index?: number
  content?: any[]
  editableProps?: EditableProps
  plugins: ((editor: PenxEditor) => PenxEditor)[]
  onChange?: (value: Descendant[], editor: PenxEditor) => void
  onBlur?: (editor: PenxEditor) => void
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>, editor?: PenxEditor) => void
}

export function QuickInputEditor({
  content = [],
  onChange,
  onBlur,
  onKeyDown,
  plugins,
}: Props) {
  const editor = useCreateEditor(plugins)
  editor.items = []

  useEffect(() => {
    setTimeout(() => {
      Transforms.select(editor, Editor.end(editor, [0]))
      ReactEditor.focus(editor)
    }, 50)
  }, [editor])

  return (
    <Slate
      editor={editor}
      initialValue={content}
      onChange={(value) => {
        onChange?.(value, editor)
      }}
    >
      {/* <HoveringToolbar /> */}
      <SetNodeToDecorations />

      <NodeEditorEditable onBlur={onBlur} onKeyDown={onKeyDown} />
    </Slate>
  )
}
