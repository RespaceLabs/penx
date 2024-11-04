import { useCallback, useEffect, useState } from 'react'
import { Editor, Transforms } from 'slate'
import { Editable, RenderElementProps, Slate } from 'slate-react'
import { ElementProps } from '@/lib/extension-typings'
import { Node } from '@/lib/model'
import { INode } from '@/lib/model'
import { Paragraph } from '@/editor-extensions/paragraph'
import { StoreProvider } from '@/store'
import { useCreateEditor } from '../hooks/useCreateEditor'
import { NodeEditorEditable } from './NodeEditorEditable'

interface Props {
  content: any[]
  nodes: INode[]
}

export function ReadOnlyEditor({ content, nodes }: Props) {
  const editor = useCreateEditor()

  editor.isReadonly = true
  editor.items = nodes.map((n) => new Node(n))

  return (
    <StoreProvider>
      <Slate editor={editor} initialValue={content}>
        <NodeEditorEditable readOnly />
      </Slate>
    </StoreProvider>
  )
}
