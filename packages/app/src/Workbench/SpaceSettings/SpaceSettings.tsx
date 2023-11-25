import { Box } from '@fower/react'
import { EncryptionKey } from './EncryptionKey'
import { SpaceName } from './SpaceName'

export function SpaceSettings() {
  return (
    <Box p10 column gap6>
      <Box text2XL fontBold>
        Space Settings
      </Box>
      <SpaceName />
      <EncryptionKey />
    </Box>
  )
}
