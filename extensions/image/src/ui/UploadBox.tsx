import { useState } from 'react'
import { Box } from '@fower/react'
import { ImageIcon } from 'lucide-react'
import { Editor, insertNodes, Path, Transforms } from 'slate'
import { ReactEditor, useFocused, useSelected } from 'slate-react'
import { Input, toast } from 'uikit'
import {
  ELEMENT_FILE_CAPTION,
  GOOGLE_DRIVE_FILE_FOLDER_NAME,
} from '@penx/constants'
import { useEditorStatic } from '@penx/editor-common'
import { getNodeByPath } from '@penx/editor-queries'
import { setNodes } from '@penx/editor-transforms'
import { calculateSHA256FromFile } from '@penx/encryption'
import { ElementProps } from '@penx/extension-typings'
import { GoogleDrive } from '@penx/google-drive'
import { useActiveSpace } from '@penx/hooks'
import { db } from '@penx/local-db'
import { useSession } from '@penx/session'
import { trpc } from '@penx/trpc-client'
import { FileCaptionElement, ImageElement } from '../types'
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

  function setFileNode(data: Partial<ImageElement>, file: File) {
    setNodes<ImageElement>(editor, data, { at: path })

    const captionPath = Path.next(path)

    try {
      Transforms.removeNodes(editor, { at: captionPath })
    } catch (error) {}

    insertNodes(
      editor,
      {
        type: ELEMENT_FILE_CAPTION,
        children: [{ text: file.name }],
      } as FileCaptionElement,
      { at: captionPath },
    )
  }

  async function handleUpload(file: File) {
    setUploading(true)

    try {
      const fileHash = await calculateSHA256FromFile(file)
      const drive = new GoogleDrive(token?.access_token!)
      const folderName = `${GOOGLE_DRIVE_FILE_FOLDER_NAME}-${session.userId}`
      const parentId = await drive.getOrCreateFolder(folderName)
      const driveFile = await drive.createFile(fileHash, file, parentId)

      await db.createFile({
        fileHash,
        googleDriveFileId: driveFile.id,
        value: file,
      })

      setFileNode(
        {
          googleDriveFileId: driveFile.id,
          fileHash: fileHash,
          mime: file.type,
        },
        file,
      )

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
      roundedXL
      bgGray100
      overflowHidden
      bgGray100--D2={active}
      contentEditable={false}
    >
      {/* TODO: why h-0 */}
      <Box h-0>{children}</Box>
      <Box p4 cursorPointer toCenter gray400 gap2>
        {/* <ImageIcon size={20} /> */}

        {/* <Input
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
        /> */}

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
