import { useCallback, useEffect, useState } from 'react'
import { Box, css } from '@fower/react'
import { ImageIcon } from 'lucide-react'
import { Resizable } from 're-resizable'
import { Transforms } from 'slate'
import {
  ReactEditor,
  useFocused,
  useSelected,
  useSlateStatic,
} from 'slate-react'
import {
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tab,
  Tabs,
  toast,
} from 'uikit'
import { setNodes } from '@penx/editor-transforms'
import { ElementProps } from '@penx/extension-typings'
import { useSpaces } from '@penx/hooks'
import { db } from '@penx/local-db'
import { ImageElement } from './types'
import { UploadButton } from './UploadButton'

export const Image = ({
  attributes,
  children,
  element,
}: ElementProps<ImageElement>) => {
  const { width: nodeWidth = '100%' } = element
  const editor = useSlateStatic()
  const selected = useSelected()
  const focused = useFocused()
  const active = selected && focused
  const [width, setWidth] = useState(nodeWidth)
  const [uploading, setUploading] = useState(false)
  const { activeSpace } = useSpaces()

  const path = ReactEditor.findPath(editor as any, element as any)

  const setNodeWidth = useCallback(
    (w: number) => {
      if (w === nodeWidth) {
        // Focus the node if not resized
        Transforms.select(editor, path)
      } else {
        setNodes<ImageElement>(editor, { width: w }, { at: path })
      }
    },
    [editor, nodeWidth, path],
  )

  useEffect(() => {
    setWidth(nodeWidth)
  }, [nodeWidth])

  const [fileUrl, setFileUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!element.fileId) return
    db.getFile(element.fileId).then((file) => {
      const url = URL.createObjectURL(file.value)
      setFileUrl(url)
    })
  }, [element])

  function setFileId(fileId: string) {
    setNodes<ImageElement>(editor, { fileId }, { at: path })
  }

  async function handleUpload(file: File) {
    setUploading(true)
    try {
      const fileInfo = await db.createFile({
        spaceId: activeSpace.id,
        value: file,
      })

      console.log('fileInfo:', fileInfo)

      setFileId(fileInfo.id!)
      setUploading(false)
    } catch (error) {
      setUploading(false)
      toast.error('Upload image failed')
      console.log('error:', error)
    }
  }

  if (fileUrl) {
    return (
      <Box {...attributes} contentEditable={false} toCenter>
        {children}
        <Resizable
          className={css({
            cursorPointer: true,
            toCenter: true,
            bgBlue500: active,
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
            src={fileUrl}
          />
        </Resizable>
      </Box>
    )
  }

  return (
    <Box
      relative
      {...attributes}
      rounded
      bgGray100
      bgGray100--D4={active}
      contentEditable={false}
    >
      <Popover initialOpened>
        <PopoverTrigger>
          <Box p4 cursorPointer toCenterY gray400 spaceX2>
            <ImageIcon />
            <Box>Add an image{children}</Box>
          </Box>
        </PopoverTrigger>
        <PopoverContent w-400>
          <Tabs defaultValue="0">
            <Tab label="Upload" value="0">
              <Box px5 pb5>
                <UploadButton
                  uploading={uploading}
                  handleFile={async (file) => {
                    await handleUpload(file)
                  }}
                />
              </Box>
            </Tab>
            <Tab label="Link" value="1">
              <Box px5 pb5>
                <Input
                  autoFocus
                  placeholder="Paste the image link..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const url = (e.target as HTMLInputElement).value
                      setFileId(url)
                    }
                  }}
                />
              </Box>
            </Tab>
          </Tabs>
        </PopoverContent>
      </Popover>
    </Box>
  )
}
