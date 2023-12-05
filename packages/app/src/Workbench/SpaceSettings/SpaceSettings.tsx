import { Box } from '@fower/react'
import { useSpaces } from '@penx/hooks'
import { DeleteSpaceModal } from './DeleteSpaceModal'
import { EncryptionPassword } from './EncryptionPassword'
import { SpaceName } from './SpaceName'

export function SpaceSettings() {
  const { activeSpace } = useSpaces()

  return (
    <Box p10 column gap6>
      <Box text2XL fontBold>
        Space Settings
      </Box>
      <SpaceName />
      {activeSpace.encrypted && <EncryptionPassword />}
      <DeleteSpaceModal />
    </Box>
  )
}
