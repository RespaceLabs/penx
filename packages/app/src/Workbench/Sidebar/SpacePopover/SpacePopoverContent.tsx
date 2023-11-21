import { Box } from '@fower/react'
import { SpaceList } from './SpaceList'
import { UserProfile } from './UserProfile'

export const SpacePopoverContent = () => {
  return (
    <Box>
      <UserProfile />
      <SpaceList />
    </Box>
  )
}
