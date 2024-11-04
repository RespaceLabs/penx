import { useCallback, useState } from 'react'
import { useEditor, useEditorStatic } from '@/lib/editor-common'
import { setNodes } from '@/lib/editor-transforms'
import { ElementProps } from '@/lib/extension-typings'
import { cn } from '@/lib/utils'
import { Resizable } from 're-resizable'
import { Transforms } from 'slate'
import {
  ReactEditor,
  useFocused,
  useSelected,
  useSlateStatic,
} from 'slate-react'
import { useGoogleDriveFile } from '../hooks/useGoogleDriveFile'
import { ImageElement } from '../types'

export const ImageView = (props: ElementProps<ImageElement>) => {
  const { attributes, children, element } = props
  const { width: nodeWidth } = element
  const editor = useEditor()
  const selected = useSelected()
  const focused = useFocused()
  const active = selected && focused
  const [width = 160, setWidth] = useState(nodeWidth)

  const path = ReactEditor.findPath(editor, element)

  const setNodeWidth = useCallback(
    (w: number) => {
      if (w === nodeWidth) {
        Transforms.select(editor, path)
      } else {
        setNodes<ImageElement>(editor, { width: w }, { at: path })
      }
    },
    [editor, nodeWidth, path],
  )

  const result = useGoogleDriveFile(element.googleDriveFileId!)

  return (
    <div className="flex" {...attributes} contentEditable={false}>
      {children}
      <Resizable
        className="cursor-pointer flex items-center justify-center active:bg-blue-500/80"
        size={{ width, height: 'auto' }}
        onResize={(_, __, ref) => setWidth(ref.offsetWidth)}
        onResizeStop={(_, __, ref) => setNodeWidth(ref.offsetWidth)}
      >
        <img
          className={cn('cursor-pointer w-full h-auto', active && 'opacity-80')}
          src={result.url}
        />
      </Resizable>
    </div>
  )
}
