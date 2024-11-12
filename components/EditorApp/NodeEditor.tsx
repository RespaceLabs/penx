import React, { PropsWithChildren, useMemo, useRef, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { SettingsDialog } from '@/components/editor/use-chat'
import { useCreateEditor } from '@/components/editor/use-create-editor'
import { CommentsPopover } from '@/components/plate-ui/comments-popover'
import { CursorOverlay } from '@/components/plate-ui/cursor-overlay'
import { Editor, EditorContainer } from '@/components/plate-ui/editor'
import { FixedToolbar } from '@/components/plate-ui/fixed-toolbar'
import { FixedToolbarButtons } from '@/components/plate-ui/fixed-toolbar-buttons'
import { FloatingToolbar } from '@/components/plate-ui/floating-toolbar'
import { FloatingToolbarButtons } from '@/components/plate-ui/floating-toolbar-buttons'
import { Node } from '@/lib/model'
import { store } from '@/store'
import { Plate } from '@udecode/plate-common/react'
import { Descendant, Path, Transforms } from 'slate'
import { EditableProps } from 'slate-react/dist/components/editable'
import { AddNodeBtn } from './AddNodeBtn'

interface Props {
  index?: number
  content: any[]
  node: Node
  isOutliner: boolean
  editableProps?: EditableProps
  onChange?: (value: Descendant[], editor: any) => void
  onBlur?: (editor: any) => void
}

export function NodeEditor({
  content,
  node,
  onChange,
  isOutliner,
  children,
}: PropsWithChildren<Props>) {
  const containerRef = useRef(null)
  const editor = useCreateEditor(content)

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate
        editor={editor}
        onChange={(e) => {
          // console.log('e=======:', e)
          onChange?.(e.value, editor)
        }}
      >
        {/* <FixedToolbar>
          <FixedToolbarButtons />
        </FixedToolbar> */}

        <EditorContainer
          id="scroll_container"
          ref={containerRef}
          variant="default"
          className="relative flex-col min-h-[60vh]"
        >
          <Editor variant="default" />
          {(node.isCommon ||
            node.isObject ||
            node.isRootNode ||
            node.isDaily) && (
            <div className="px-4">
              <AddNodeBtn editor={editor} />
            </div>
          )}

          <FloatingToolbar>
            <FloatingToolbarButtons />
          </FloatingToolbar>

          <CommentsPopover />

          <CursorOverlay containerRef={containerRef} />
        </EditorContainer>

        <SettingsDialog />
      </Plate>
    </DndProvider>
  )
}
