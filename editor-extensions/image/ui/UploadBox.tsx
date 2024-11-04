import { useState } from 'react'
import { ELEMENT_FILE_CAPTION } from '@/lib/constants'
import { useEditorStatic } from '@/lib/editor-common'
import { getNodeByPath } from '@/lib/editor-queries'
import { setNodes } from '@/lib/editor-transforms'
import { calculateSHA256FromFile } from '@/lib/encryption'
import { ElementProps } from '@/lib/extension-typings'
import { GoogleDrive } from '@/lib/google-drive'
import { db } from '@/lib/local-db'
import { cn } from '@/lib/utils'
import { ImageIcon } from 'lucide-react'
import { Editor, insertNodes, Path, Transforms } from 'slate'
import { ReactEditor, useFocused, useSelected } from 'slate-react'
import { toast } from 'sonner'
import { FileCaptionElement, ImageElement } from '../types'
import { UploadButton } from '../UploadButton'

export const UploadBox = ({
  attributes,
  children,
  element,
}: ElementProps<ImageElement>) => {
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
    } catch (error) {
      setUploading(false)
      toast.error('Upload image failed')
      console.log('error:', error)
    }
  }

  return (
    <div
      {...attributes}
      className={cn(
        'relative rounded-xl bg-foreground/10 overflow-hidden active:bg-foreground/15',
      )}
      contentEditable={false}
    >
      <div>{children}</div>
      <div className="p-4 cursor-pointer flex items-center justify-self-center bg-foreground/40 gap-2">
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
      </div>
    </div>
  )
}
