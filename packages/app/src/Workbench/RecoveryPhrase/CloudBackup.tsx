import { Suspense } from 'react'
import { Box } from '@fower/react'
import { trpc } from '@penx/trpc-client'
import { CloudBackupModal } from './CloudBackupModal'
import { GoogleOauthButton } from './GoogleOauthButton'

export function CloudBackup() {
  const { data: token, isLoading } = trpc.google.googleDriveToken.useQuery()

  if (isLoading) return null // TODO: show spinner

  if (!token) {
    return (
      <Suspense fallback={<Box my2 h10 w-100p border borderStone200 />}>
        <GoogleOauthButton />
      </Suspense>
    )
  }

  return <CloudBackupModal />
}
