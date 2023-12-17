import { useState } from 'react'
import { Box } from '@fower/react'
import { ImageIcon } from 'lucide-react'
import { ReactEditor, useFocused, useSelected } from 'slate-react'
import { Input, toast } from 'uikit'
import { useEditorStatic } from '@penx/editor-common'
import { setNodes } from '@penx/editor-transforms'
import { ElementProps } from '@penx/extension-typings'
import { useSpaces } from '@penx/hooks'
import { db } from '@penx/local-db'
import { FileElement } from '../types'
import { UploadButton } from '../UploadButton'

export const UploadBox = ({
  attributes,
  children,
  element,
}: ElementProps<FileElement>) => {
  const editor = useEditorStatic()
  const selected = useSelected()
  const focused = useFocused()
  const active = selected && focused
  const [uploading, setUploading] = useState(false)
  const { activeSpace } = useSpaces()

  const path = ReactEditor.findPath(editor, element)

  function setFileId(fileId: string) {
    setNodes<FileElement>(editor, { fileId }, { at: path })
  }

  async function handleUpload(file: File) {
    setUploading(true)

    try {
      const fileInfo = await db.createFile({
        spaceId: activeSpace.id,
        value: file,
      })

      setFileId(fileInfo.id!)
      setUploading(false)
    } catch (error) {
      setUploading(false)
      toast.error('Upload image failed')
      console.log('error:', error)
    }
  }

  return (
    <Box
      {...attributes}
      relative
      my2
      roundedXL
      bgGray100
      bgGray100--D2={active}
      contentEditable={false}
    >
      <Box>{children}</Box>
      <Box p4 cursorPointer toCenterY gray400 gap2>
        <ImageIcon size={20} />

        <Input
          flex-1
          bgTransparent
          variant="unstyled"
          placeholder="Paste the image link..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const url = (e.target as HTMLInputElement).value
              setFileId(url)
            }
          }}
        />

        <UploadButton
          flex-1
          uploading={uploading}
          handleFile={async (file) => {
            await handleUpload(file)
          }}
        />
      </Box>
    </Box>
  )
}
