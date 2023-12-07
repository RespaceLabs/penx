import { Box } from '@fower/react'
import { Tag } from 'uikit'
import { useSpaces } from '@penx/hooks'
import { DeleteSpaceModal } from '../DeleteSpaceModal'
import { ExportToJSON } from '../ExportToJSON'
import { EncryptionPassword } from './EncryptionPassword'
import { SpaceName } from './SpaceName'

export function SpaceSettings() {
  const { activeSpace } = useSpaces()

  return (
    <Box p10 column gap6>
      <Box toCenterY gap2>
        <Box text2XL fontBold>
          Space Settings
        </Box>
        <Tag variant="light" colorScheme="gray400">
          {activeSpace.id}
        </Tag>
      </Box>
      <SpaceName />
      {activeSpace.encrypted && <EncryptionPassword />}
      <ExportToJSON />
      <DeleteSpaceModal />
    </Box>
  )
}
