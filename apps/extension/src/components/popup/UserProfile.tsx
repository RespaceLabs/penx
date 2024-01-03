import { Box } from '@fower/react'
import { Avatar, AvatarImage } from 'uikit'

import { useSession } from '~/hooks/useSession'

export function UserProfile() {
  const { loading, data } = useSession()
  if (loading) return null

  return (
    <Box toCenterY gap2>
      <Avatar size={24}>
        <AvatarImage src={data.user?.image || ''} />
      </Avatar>
      <Box textSM>{data.user.email}</Box>
    </Box>
  )
}
