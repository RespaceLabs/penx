import { useCallback, useEffect, useState } from 'react'
import { Editor, Transforms } from 'slate'
import {
  Editable,
  RenderElementProps,
  Slate,
  useSlate,
  useSlateStatic,
} from 'slate-react'
import { getAtomicProps } from '@penx/editor-shared/src/getAtomicProps'
import { EditorPlugin, ElementProps } from '@penx/editor-types'
import { useCreateEditor } from '../hooks/useCreateEditor'
import { Paragraph } from '../plugins/paragraph/Paragraph'

function EditorElement(props: ElementProps) {
  const editor = useSlateStatic()
  const { element } = props
  const { type } = element
  const { component: Element = Paragraph, placeholder } =
    editor.elementMaps[type] || {}

  return <Element {...props} />
}

interface Props {
  content: any[]
  plugins?: EditorPlugin[]
}

export function ReadOnlyEditor({ content, plugins = [] }: Props) {
  const editor = useCreateEditor(plugins)

  const renderElement = useCallback(
    (p: RenderElementProps) => {
      const { element } = p
      const attr = {
        ...p.attributes,
        'data-slate-type': element.type,
      }

      const atomicProps = getAtomicProps(element?.css)

      return (
        <EditorElement {...p} attributes={attr} atomicProps={atomicProps} />
      )
    },
    [editor],
  )
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
  }, [content])

  return (
    <Slate editor={editor} initialValue={content}>
      <Editable readOnly renderElement={renderElement} />
    </Slate>
  )
}
