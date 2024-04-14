import { useCallback, useState } from 'react'
import { Box, css } from '@fower/react'
import { Resizable } from 're-resizable'
import { Transforms } from 'slate'
import {
  ReactEditor,
  useFocused,
  useSelected,
  useSlateStatic,
} from 'slate-react'
import { useEditor, useEditorStatic } from '@penx/editor-common'
import { setNodes } from '@penx/editor-transforms'
import { ElementProps } from '@penx/extension-typings'
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
    <Box {...attributes} contentEditable={false} toLeft>
      {children}
      <Resizable
        className={css({
          cursorPointer: true,
          toCenter: true,
          'bgBlue500--T80': active,
        })}
        size={{ width, height: 'auto' }}
        onResize={(_, __, ref) => setWidth(ref.offsetWidth)}
        onResizeStop={(_, __, ref) => setNodeWidth(ref.offsetWidth)}
      >
        <Box
          as="img"
          opacity-80={active}
          cursorPointer
          w-100p
          h-auto
          src={result.url}
        />
      </Resizable>
    </Box>
  )
}
