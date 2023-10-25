import { useCallback, useEffect, useState } from 'react'
import { Editor, Transforms } from 'slate'
import { Editable, RenderElementProps, Slate } from 'slate-react'
import { ElementProps } from '@penx/extension-typings'
import { useExtensionStore } from '@penx/hooks'
import { Paragraph } from '@penx/paragraph'
import { useCreateEditor } from '../hooks/useCreateEditor'

function EditorElement(props: ElementProps) {
  const { extensionStore } = useExtensionStore()
  const { element } = props
  const { type } = element as any

  const { component: Element = Paragraph } =
    extensionStore.elementMaps[type] || {}

  return <Element {...props} />
}

interface Props {
  content: any[]
}

export function ReadOnlyEditor({ content }: Props) {
  const editor = useCreateEditor()

  const renderElement = useCallback((p: RenderElementProps) => {
    return <EditorElement {...p} />
  }, [])
  useEffect(() => {
    // Delete all entries leaving 1 empty node
    Transforms.delete(editor, {
      at: {
        anchor: Editor.start(editor, []),
        focus: Editor.end(editor, []),
      },
    })

    // Removes empty node
    Transforms.removeNodes(editor, {
      at: [0],
    })

    // Insert array of children nodes
    Transforms.insertNodes(editor, content)
  }, [content, editor])

  return (
    <Slate editor={editor} initialValue={content}>
      <Editable readOnly renderElement={renderElement} />
    </Slate>
  )
}
