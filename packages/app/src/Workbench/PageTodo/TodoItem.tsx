import { FC, memo, useCallback, useEffect, useRef, useState } from 'react'
import { Box, css } from '@fower/react'
import { createEditor, Editor } from 'slate'
import { withHistory } from 'slate-history'
import { Editable, RenderElementProps, Slate, withReact } from 'slate-react'
import { NodeEditor, NodeEditorEditable, useCreateEditor } from '@penx/editor'
import { TElement } from '@penx/editor-common'
import { Leaf } from '@penx/editor-leaf'
import { db } from '@penx/local-db'
import { Paragraph } from '@penx/paragraph'
import { store, TodoRecord } from '@penx/store'

interface TodoItemProps {
  todo: TodoRecord
}

export const TodoItem = ({ todo }: TodoItemProps) => {
  const { row, todoNode } = todo
  const editor = useCreateEditor([])

  editor.isInTodoPage = true

  return (
    <Box>
      <Slate
        editor={editor}
        initialValue={todoNode.element}
        onChange={async (value) => {
          // onChange?.(element)
          db.updateNode(todoNode.id, { element: value[0] })
          // updateParentEditor(element)
        }}
      >
        {/* <HoveringToolbar /> */}
        <NodeEditorEditable editorAtomicStyle="w-100p py2" />
      </Slate>
    </Box>
  )
}
