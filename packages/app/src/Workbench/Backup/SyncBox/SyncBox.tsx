import { Box } from '@fower/react'
import { useUser } from '@penx/hooks'
import { ConnectGitHub } from './ConnectGitHub'

export const SyncBox = () => {
  const { user } = useUser()

  return (
    <Box bgWhite mt8>
      {user.id && <ConnectGitHub />}
    </Box>
  )
}
