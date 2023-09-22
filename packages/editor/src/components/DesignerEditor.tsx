import { ReactNode, useEffect } from 'react'
import { Box } from '@fower/react'
import { Descendant, Editor, Transforms } from 'slate'
import { ReactEditor, Slate } from 'slate-react'
import { EditableProps } from 'slate-react/dist/components/editable'
import { getCurrentNode } from '@penx/editor-queries'
import { EditorPlugin, PluginElement } from '@penx/editor-types'
import { useCreateEditor } from '../hooks/useCreateEditor'
import { useMounted } from '../hooks/useMounted'
import { ConfigPanel } from './ConfigPanel'
import { DesignerEditable } from './DesignerEditable'
import HoveringToolbar from './HoveringToolbar/HoveringToolbar'

interface Props {
  content: any[]
  renderPrefix?: (editor: Editor) => ReactNode
  editableProps?: EditableProps
  plugins?: EditorPlugin[]
  onChange?: (value: Descendant[], editor: Editor) => void
}

export function DesignerEditor({
  content,
  onChange,
  renderPrefix,
  plugins = [],
}: Props) {
  const editor = useCreateEditor(plugins)

  const { mounted } = useMounted()
  useEffect(() => {
    const block = Editor.above(editor, {
      match: (n) => Editor.isBlock(editor, n as any),
    })

    const at = block ? block[1] : []
    Transforms.select(editor, Editor.start(editor, at))
    ReactEditor.focus(editor)
  }, [])

  // useEffect(() => {
  //   if (!mounted) return
  //   // Delete all entries leaving 1 empty node
  //   Transforms.delete(editor, {
  //     at: {
  //       anchor: Editor.start(editor, []),
  //       focus: Editor.end(editor, []),
  //     },
  //   })
  //   // Removes empty node
  //   Transforms.removeNodes(editor, {
  //     at: [0],
  //   })
  //   // Insert array of children nodes
  //   Transforms.insertNodes(editor, content)
  // }, [content])

  const node = getCurrentNode(editor)!

  return (
    <Slate
      editor={editor}
      initialValue={content}
      onChange={(value) => {
        onChange?.(value, editor)
      }}
    >
      <Box flex-1 h={`calc(100vh - 50px)`} overflowScroll px-1>
        {renderPrefix?.(editor)}
        <HoveringToolbar />
        <DesignerEditable />
      </Box>
      {/* <ClickablePadding /> */}

      <Box w-400 borderLeft h-100p>
        <ConfigPanel />
      </Box>
    </Slate>
  )
}
