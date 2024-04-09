import { Suspense } from 'react'
import { Box } from '@fower/react'
import { useUser } from '@penx/hooks'
import { trpc } from '@penx/trpc-client'
import { GoogleOauthButton } from '../RecoveryPhrase/GoogleOauthButton'
import { GoogleBackupConnected } from './GoogleBackupConnected'

function Content() {
  const {
    data: token,
    isLoading,
    refetch,
  } = trpc.google.googleDriveToken.useQuery()
  if (isLoading) return null // TODO: show spinner

  if (!token?.access_token) {
    return (
      <Suspense fallback={<Box my2 h10 w-100p border borderStone200 />}>
        <GoogleOauthButton />
      </Suspense>
    )
  }

  return <GoogleBackupConnected data={token} refetch={refetch} />
}

export function GoogleBackup() {
  return (
    <Box p10 relative column gap6>
      <Box>
        <Box text3XL mb4 fontBold>
          Google Drive backup
        </Box>
        <Box gray600 mb1>
          In PenX, one of most important concept is owning your data. you can
          use Google Drive to backup your data.
        </Box>
      </Box>

      <Content />
    </Box>
  )
}
