import { useRef, useState } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'
import { Import, UploadCloud } from 'lucide-react'
import { Button, Spinner } from 'uikit'
import { store } from '@penx/store'

interface Props extends FowerHTMLProps<'div'> {}

export const UploadButton = ({ ...rest }: Props) => {
  const [uploading, setUploading] = useState(false)
  const hiddenFileInput = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    hiddenFileInput.current?.click?.()
  }

  function handleFile(file: File) {
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = (event) => {
      const content = event.target?.result
      const data = JSON.parse((content as string) || '{}')
      console.log('data:', data)
      // should validate the data
      store.node.importSpace(data.space, data.nodes)
    }
  }
  return (
    <Box {...rest}>
      <Button variant="ghost" w-100p onClick={handleClick}>
        <Import size={20} />
        {!uploading && <Box>Import Space</Box>}
        {uploading && (
          <Box toCenterY gapX2>
            <Spinner />
            <Box>Import...</Box>
          </Box>
        )}
      </Button>
      <input
        type="file"
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
