import { Box } from '@fower/react'
import { useUser } from '@penx/hooks'
import { ConnectGitHub } from './ConnectGitHub'

export const SyncBox = () => {
  const { id } = useUser()
  return (
    <Box bgWhite mt8>
      <Box heading2>Github Connection</Box>
      <Box mb6 gray600>
        Connect to you GitHub Repository, so you can sync docs to GitHub
      </Box>
      {id && <ConnectGitHub />}
    </Box>
  )
}
