import { Box } from '@fower/react'
import { useSession } from 'next-auth/react'
import { SpaceList } from './SpaceList'
import { UserProfile } from './UserProfile'

export const SpacePopoverContent = () => {
  const { status, data } = useSession()

  return (
    <Box>
      <UserProfile />
      <SpaceList />
    </Box>
  )
}
