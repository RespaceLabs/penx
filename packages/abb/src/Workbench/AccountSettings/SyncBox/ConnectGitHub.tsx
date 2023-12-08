import { Box } from '@fower/react'
import { GitHubAuthButton } from './GitHubAuthButton'
import { GithubConnectionBox } from './GitHubConnectionBox'
import { GitIntegration } from './GitIntegration'
import { useGitHubToken } from './useGitHubToken'

export const ConnectGitHub = () => {
  const { github, isTokenValid, isLoading } = useGitHubToken()

  return (
    <Box rounded2XL>
      <GithubConnectionBox isLoading={isLoading}>
        {isTokenValid ? (
          <GitIntegration github={github!} />
        ) : (
          <GitHubAuthButton />
        )}
      </GithubConnectionBox>
    </Box>
  )
}
