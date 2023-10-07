import { Box } from '@fower/react'
import { DownloadCloudIcon } from 'lucide-react'
import { Button } from 'uikit'
import { useExtension } from './hooks/useExtension'

export function ExtensionDetail() {
  const { extension } = useExtension()
  console.log('extension:', extension)

  if (!extension) return null

  return (
    <Box flex-1 p4 column gap2>
      <Box textLG fontBold>
        {extension.name}
      </Box>

      <Box gray500 textXS>
        By 0xZion
      </Box>
      <Box gray500>{extension.description}</Box>
      <Box toBetween toCenterY>
        <Box textSM gray500 toCenterY gap1>
          <DownloadCloudIcon size={16} />
          <Box>6,3434</Box>
        </Box>

        {/* <Button size={24} variant="light">
          Install
        </Button> */}
      </Box>
    </Box>
  )
}
