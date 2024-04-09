import { Box } from '@fower/react'
import { useUser } from '@penx/hooks'
import { RestoreFromGitHubModal } from '../RestoreFromGitHubModal/RestoreFromGitHubModal'
import { SyncBox } from './SyncBox/SyncBox'
import { VersionRestore } from './VersionRestore'

export function GitHubBackup() {
  const { user } = useUser()

  return (
    <Box p10 relative>
      <Box>
        <Box text3XL mb4 fontBold>
          GitHub backup
        </Box>
        <Box gray600 mb1>
          In PenX, one of most important concept is owning your data. you can
          use GitHub to backup your data.
        </Box>

        <Box gray600>
          If you have any problem to setup github backup, you can join{' '}
          <Box
            as="a"
            target="_blank"
            href="https://discord.gg/nyVpH9njDu"
            brand500
          >
            Discord
          </Box>{' '}
          and get help.
        </Box>
      </Box>

      <Box>
        <SyncBox />
        {user.repo && (
          <>
            <RestoreFromGitHubModal />
            <Box pt10>
              <VersionRestore />
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}
