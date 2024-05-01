import { Suspense } from 'react'
import { isMobile } from 'react-device-detect'
import { Box } from '@fower/react'
import { trpc } from '@penx/trpc-client'
import { CloudBackupDrawer, CloudBackupModal } from './CloudBackupModal'
import { GoogleOauthButton } from './GoogleOauthButton'

export function CloudBackup() {
  const { data: token, isLoading } = trpc.google.googleDriveToken.useQuery()

  if (isLoading) return null // TODO: show spinner

  if (!token?.access_token) {
    return (
      <Suspense fallback={<Box my2 h10 w-100p border borderStone200 />}>
        <GoogleOauthButton from="mnemonic" />
      </Suspense>
    )
  }

  return <>{isMobile ? <CloudBackupDrawer /> : <CloudBackupModal />}</>
}
