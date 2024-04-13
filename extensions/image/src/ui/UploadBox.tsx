import { useState } from 'react'
import { Box } from '@fower/react'
import { ImageIcon } from 'lucide-react'
import { ReactEditor, useFocused, useSelected } from 'slate-react'
import { Input, toast } from 'uikit'
import { GOOGLE_DRIVE_FILE_FOLDER_NAME } from '@penx/constants'
import { useEditorStatic } from '@penx/editor-common'
import { setNodes } from '@penx/editor-transforms'
import { calculateSHA256FromFile } from '@penx/encryption'
import { ElementProps } from '@penx/extension-typings'
import { GoogleDrive } from '@penx/google-drive'
import { useActiveSpace } from '@penx/hooks'
import { db } from '@penx/local-db'
import { useSession } from '@penx/session'
import { trpc } from '@penx/trpc-client'
import { ImageElement } from '../types'
import { UploadButton } from '../UploadButton'

export const UploadBox = ({
  attributes,
  children,
  element,
}: ElementProps<ImageElement>) => {
  const { data: token } = trpc.google.googleDriveToken.useQuery()
  const { data: session } = useSession()
  const editor = useEditorStatic()
  const selected = useSelected()
  const focused = useFocused()
  const active = selected && focused
  const [uploading, setUploading] = useState(false)
  const path = ReactEditor.findPath(editor, element)

  function setFileNode(data: Partial<ImageElement>) {
    setNodes<ImageElement>(editor, data, { at: path })
  }

  async function handleUpload(file: File) {
    setUploading(true)

    try {
      const hash = await calculateSHA256FromFile(file)
      const drive = new GoogleDrive(token?.access_token!)
      const folderName = `${GOOGLE_DRIVE_FILE_FOLDER_NAME}-${session.userId}`
      const parentId = await drive.getOrCreateFolder(folderName)
      const driveFile = await drive.createFile(hash, file, parentId)

      await db.createFile({
        hash,
        googleDriveId: driveFile.id,
        value: file,
      })

      setFileNode({
        googleDriveId: driveFile.id,
        hash,
        mime: file.type,
      })

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
              setFileNode({ url })
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
