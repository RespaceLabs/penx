import { Box } from '@fower/react'
import { useActiveSpace, useSpaces } from '@penx/hooks'
import { CreateSpaceBtn } from './CreateSpaceBtn'
import { SpaceItem } from './SpaceItem'
import { UploadButton } from './UploadButton'

export const SpaceList = () => {
  const { spaces } = useSpaces()
  const { activeSpace } = useActiveSpace()

  return (
    <Box toCenterX w-100p p2>
      <Box flex-1 column gap-2>
        {spaces?.map((item) => (
          <SpaceItem key={item.id} item={item} activeSpace={activeSpace} />
        ))}
        <Box>
          <CreateSpaceBtn />
          <UploadButton />
        </Box>
      </Box>
    </Box>
  )
}
