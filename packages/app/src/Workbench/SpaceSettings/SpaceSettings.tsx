import { Box } from '@fower/react'
import { DeleteSpaceModal } from './DeleteSpaceModal'
import { EncryptionPassword } from './EncryptionPassword'
import { SpaceName } from './SpaceName'

export function SpaceSettings() {
  return (
    <Box p10 column gap6>
      <Box text2XL fontBold>
        Space Settings
      </Box>
      <SpaceName />
      <EncryptionPassword />
      <DeleteSpaceModal />
    </Box>
  )
}
