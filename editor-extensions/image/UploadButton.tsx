import { useRef } from 'react'
import { UploadCloud } from 'lucide-react'

interface Props {
  uploading: boolean
  handleFile: (file: File) => void
}

export const UploadButton = ({ handleFile, uploading, ...rest }: Props) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    hiddenFileInput.current?.click?.()
  }
  return (
    <div {...rest}>
      <a
        onClick={handleClick}
        className="text-foreground/50 bg-transparent w-full flex items-center gap-2 text-sm hover:text-brand-500"
      >
        {!uploading && <UploadCloud size={20} />}
        {!uploading && <div>Upload a image</div>}
        {uploading && (
          <div className="flex items-center gap-x-2">
            <div>Uploading...</div>
          </div>
        )}
      </a>
      <input
        type="file"
        accept="image/*"
        onChange={(event) => {
          const fileUploaded = event.target.files?.[0]!
          handleFile(fileUploaded)
        }}
        ref={hiddenFileInput}
        style={{ display: 'none' }}
      />
    </div>
  )
}
