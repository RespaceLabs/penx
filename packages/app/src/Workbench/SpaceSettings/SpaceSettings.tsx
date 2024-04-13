import { Box } from '@fower/react'
import { Button, modalController, Tag } from 'uikit'
import { ModalNames } from '@penx/constants'
import { useSpaces } from '@penx/hooks'
import { Space } from '@penx/model'
import { DeleteSpaceModal } from '../DeleteSpaceModal'
import { ExportToJSON } from '../ExportToJSON'
import { SpaceName } from './SpaceName'

interface Props {
  spaceId: string
}

export function SpaceSettings({ spaceId }: Props) {
  const { spaces } = useSpaces()

  const currentSpace = spaces.find((s) => s.id === spaceId)

  if (!currentSpace) return null

  const space = new Space(currentSpace)

  return (
    <Box column gap10>
      <Box toCenterY gap2 flexDirection={['column', 'row']}>
        <Box text2XL fontBold>
          Space Settings
        </Box>

        <Tag variant="light" colorScheme="gray400">
          {space.id}
        </Tag>
      </Box>
      <SpaceName space={space} />

      <ExportToJSON space={space} />
      {!space.isLocal && (
        <Box>
          <DeleteSpaceModal />

          <Button
            variant="outline"
            colorScheme="red500"
            onClick={() => {
              modalController.open(ModalNames.DELETE_SPACE, space)
            }}
          >
            Delete entire space
          </Button>
        </Box>
      )}
    </Box>
  )
}
