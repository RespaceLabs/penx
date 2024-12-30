'use client'

import React, { useEffect, useRef } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ReactEditor } from 'slate-react'
import { SettingsDialog } from '@/components/editor/use-chat'
import { useCreateEditor } from '@/components/editor/use-create-editor'
import { CommentsPopover } from '@/components/plate-ui/comments-popover'
import { CursorOverlay } from '@/components/plate-ui/cursor-overlay'
import { Editor, EditorContainer } from '@/components/plate-ui/editor'
import { FixedToolbar } from '@/components/plate-ui/fixed-toolbar'
import { FixedToolbarButtons } from '@/components/plate-ui/fixed-toolbar-buttons'
import { FloatingToolbar } from '@/components/plate-ui/floating-toolbar'
import { FloatingToolbarButtons } from '@/components/plate-ui/floating-toolbar-buttons'
import { appEmitter } from '@/lib/app-emitter'
import { cn } from '@/lib/utils'
import { findNodePath, Plate, selectEditor } from '@udecode/plate-common/react'
import { AddNodeBtn } from '../AddNodeBtn'

interface Props {
  readonly?: boolean
  value: any
  className?: string
  showAddButton?: boolean
  onChange?: (value: any) => void
}

export function PlateEditor({
  onChange,
  value,
  className,
  showAddButton = false,
  readonly = false,
}: Props) {
  const containerRef = useRef(null)
  const editor = useCreateEditor(value)

  useEffect(() => {
    appEmitter.on('KEY_DOWN_ENTER_ON_TITLE', () => {
      if (editor) {
        // TODO: why error when create page
        try {
          ReactEditor.focus(editor as any)
          // selectEditor(editor, {})
        } catch (error) {
          console.log('========error:', error)
        }
      }
    })
  }, [])

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate
        editor={editor}
        onValueChange={({ value }) => {
          onChange?.(value)
        }}
      >
        {/* <FixedToolbar>
          <FixedToolbarButtons />
        </FixedToolbar> */}

        <Editor
          variant="default"
          readOnly={readonly}
          className={cn(className)}
        />

        <EditorContainer id="scroll_container" ref={containerRef}>
          <FloatingToolbar>
            <FloatingToolbarButtons />
          </FloatingToolbar>

          {/* <CommentsPopover /> */}
          {showAddButton && <AddNodeBtn editor={editor} />}

          <CursorOverlay containerRef={containerRef} />
        </EditorContainer>

        {/* <SettingsDialog /> */}
      </Plate>
    </DndProvider>
  )
}
