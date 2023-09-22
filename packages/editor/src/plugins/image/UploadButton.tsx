import { useRef } from 'react'
import { Box } from '@fower/react'
import { Button, Spinner } from 'uikit'

interface Props {
  uploading: boolean
  handleFile: (file: File) => void
}

export const UploadButton = ({ handleFile, uploading }: Props) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    hiddenFileInput.current?.click?.()
  }
  return (
    <Box>
      <Button
        onClick={handleClick}
        colorScheme="white"
        disabled={uploading}
        w-100p
      >
        {!uploading && <Box>Upload a file</Box>}
        {uploading && (
          <Box toCenterY gapX2>
            <Spinner />
            <Box>Uploading...</Box>
          </Box>
        )}
      </Button>
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
    </Box>
  )
}
