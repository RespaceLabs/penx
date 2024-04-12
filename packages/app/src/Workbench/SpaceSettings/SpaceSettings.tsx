import { Box } from '@fower/react'
import { Tag } from 'uikit'
import { useActiveSpace } from '@penx/hooks'
import { DeleteSpaceModal } from '../DeleteSpaceModal'
import { ExportToJSON } from '../ExportToJSON'
import { SpaceName } from './SpaceName'

export function SpaceSettings() {
  const { activeSpace } = useActiveSpace()

  return (
    <Box p10 column gap10>
      <Box toLeft toCenterY gap2 flexDirection={['column', 'row']}>
        <Box text2XL fontBold>
          Space Settings
        </Box>
        <Box>
          <Tag variant="light" colorScheme="gray400">
            {activeSpace.id}
          </Tag>
        </Box>
      </Box>
      <SpaceName />

      <ExportToJSON />
      {!activeSpace.isLocal && <DeleteSpaceModal />}
    </Box>
  )
}
