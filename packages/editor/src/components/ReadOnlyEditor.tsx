import { useCallback, useEffect, useState } from 'react'
import { Editor, Transforms } from 'slate'
import {
  Editable,
  RenderElementProps,
  Slate,
  useSlateStatic,
} from 'slate-react'
import { usePluginStore } from '@penx/hooks'
import { Paragraph } from '@penx/paragraph'
import { ElementProps } from '@penx/plugin-typings'
import { useCreateEditor } from '../hooks/useCreateEditor'

function EditorElement(props: ElementProps) {
  const { pluginStore } = usePluginStore()
  const { element } = props
  const { type } = element as any

  const { component: Element = Paragraph } = pluginStore.elementMaps[type] || {}

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
    <Slate editor={editor as any} initialValue={content}>
      <Editable readOnly renderElement={renderElement} />
    </Slate>
  )
}
