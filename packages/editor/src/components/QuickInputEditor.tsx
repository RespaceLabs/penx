import { useEffect } from 'react'
import { Descendant, Editor } from 'slate'
import { Slate } from 'slate-react'
import { EditableProps } from 'slate-react/dist/components/editable'
import { SetNodeToDecorations } from '@penx/code-block'
import { PenxEditor } from '@penx/editor-common'
import { useCreateEditor } from '../hooks/useCreateEditor'
import { NodeEditorEditable } from './NodeEditorEditable'

interface Props {
  index?: number
  content?: any[]
  editableProps?: EditableProps
  plugins: ((editor: PenxEditor) => PenxEditor)[]
  onChange?: (value: Descendant[], editor: Editor) => void
  onBlur?: (editor: PenxEditor) => void
}

export function QuickInputEditor({
  content = [],
  onChange,
  onBlur,
  plugins,
}: Props) {
  const editor = useCreateEditor(plugins)
  editor.items = []

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

      <NodeEditorEditable onBlur={onBlur} />
    </Slate>
  )
}
