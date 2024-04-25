import { Box } from '@fower/react'
import { Avatar, AvatarImage, Button, modalController } from 'uikit'
import { ModalNames } from '@penx/constants'
import { Commit, RestoreFromGitHubModalData } from './types'

interface CommitListProps {
  commits: Commit[]
}

export function CommitList({ commits }: CommitListProps) {
  return (
    <Box column gap4>
      {commits.map((commit) => (
        <Box key={commit.sha} toBetween toCenterY>
          <Box column gap1>
            <Box textBase>{commit.commit.message}</Box>
            <Box toCenterY gap1 gray500>
              <Avatar size={16}>
                <AvatarImage src={commit.author?.avatar_url} />
              </Avatar>
              <Box textXS>{commit.author?.login}</Box>
              <Box textXS ml2>
                {commit.sha}
              </Box>
            </Box>
          </Box>
          <Button
            colorScheme="white"
            size="sm"
            roundedFull
            onClick={() => {
              //
              modalController.open(ModalNames.RESTORE_FROM_GITHUB, {
                commitHash: commit.sha,
              } as RestoreFromGitHubModalData)
            }}
          >
            Restore this version
          </Button>
        </Box>
      ))}
    </Box>
  )
}
