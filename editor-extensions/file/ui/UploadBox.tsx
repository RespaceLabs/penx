import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { useEditorStatic } from '@/lib/editor-common'
import { setNodes } from '@/lib/editor-transforms'
import { ElementProps } from '@/lib/extension-typings'
import { cn } from '@/lib/utils'
import { ImageIcon } from 'lucide-react'
import { ReactEditor, useFocused, useSelected } from 'slate-react'
import { toast } from 'sonner'
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

  const path = ReactEditor.findPath(editor, element)

  function setFileId(fileId: string) {
    setNodes<FileElement>(editor, { fileId }, { at: path })
  }

  async function handleUpload(file: File) {
    setUploading(true)

    try {
      // const fileInfo = await db.createFile({
      //   spaceId: activeSpace.id,
      //   value: file,
      // })
      // setFileId(fileInfo.id!)
      // setUploading(false)
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
        'relative my-2 rounded-xl bg-foreground/5',
        active && 'bg-foreground/10',
      )}
      bgGray100--D2={active}
      contentEditable={false}
    >
      <div>{children}</div>
      <div className="p-4 cursor-pointer flex items-center text-foreground/40 gap-2">
        <ImageIcon size={20} />

        <Input
          placeholder="Paste the image link..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const url = (e.target as HTMLInputElement).value
              setFileId(url)
            }
          }}
        />

        <UploadButton
          uploading={uploading}
          handleFile={async (file) => {
            await handleUpload(file)
          }}
        />
      </div>
    </div>
  )
}
