import { Box } from '@fower/react'
import { useSidebarDrawer, useSpaces } from '@penx/hooks'
import { CreateSpaceBtn } from './CreateSpaceBtn'
import { ImportFromGithubBtn } from './ImportFromGithubBtn'
import { SpaceItem } from './SpaceItem'
import { UploadButton } from './UploadButton'

export const SpaceList = () => {
  const { spaces, activeSpace } = useSpaces()

  return (
    <Box toCenterX w-100p p2>
      <Box flex-1 column gap-2>
        {spaces?.map((item) => (
          <SpaceItem key={item.id} item={item} activeSpace={activeSpace} />
        ))}
        <Box>
          <CreateSpaceBtn />
          <UploadButton />
          <ImportFromGithubBtn />
        </Box>
      </Box>
    </Box>
  )
}
