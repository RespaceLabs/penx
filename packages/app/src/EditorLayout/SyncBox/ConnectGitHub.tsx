import { Box } from '@fower/react'
import { GitHubAuthButton } from './GitHubAuthButton'

export const ConnectGitHub = () => {
  return (
    <Box rounded2XL>
      <Box heading2>Github Connection</Box>
      <Box mb6 gray600>
        Connect to you GitHub Repository, so you can sync docs to GitHub
      </Box>
      <GitHubAuthButton />
    </Box>
  )
}
