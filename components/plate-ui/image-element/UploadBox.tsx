import { useState } from 'react'
import { uploadFile } from '@/lib/uploadFile'
import { cn } from '@/lib/utils'
import { PlateElementProps } from '@udecode/plate-common/react'
import { Editor, insertNodes, Path, setNodes, Transforms } from 'slate'
import { ReactEditor, useFocused, useSelected, useSlate } from 'slate-react'
import { toast } from 'sonner'
// import { FileCaptionElement, ImageElement } from '../types'
import { UploadButton } from './UploadButton'

type ImageElement = any

export const UploadBox = ({
  attributes,
  children,
  element,
}: PlateElementProps<ImageElement>) => {
  const editor = useSlate()
  const selected = useSelected()
  const focused = useFocused()
  const [uploading, setUploading] = useState(false)
  const path = ReactEditor.findPath(editor, element)

  function setFileNode(data: Partial<ImageElement>, file: File) {
    setNodes<ImageElement>(editor, data, { at: path })
    console.log('======data:', data)

    const captionPath = Path.next(path)

    try {
      Transforms.removeNodes(editor, { at: captionPath })
    } catch (error) {}
  }

  async function handleUpload(file: File) {
    setUploading(true)

    try {
      const data = await uploadFile(file)
      setFileNode(
        {
          mime: file.type,
          url: data.url,
        },
        file,
      )

      toast.success('Image uploaded successfully!')
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
        'relative rounded-xl bg-foreground/5 overflow-hidden active:bg-foreground/10',
      )}
      contentEditable={false}
    >
      <div>{children}</div>
      <div className="p-4 cursor-pointer flex items-center justify-center text-foreground/40 gap-2">
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
          className="flex-1"
          uploading={uploading}
          handleFile={async (file) => {
            await handleUpload(file)
          }}
        />
      </div>
    </div>
  )
}
