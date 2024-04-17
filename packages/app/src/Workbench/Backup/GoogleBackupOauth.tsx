import { Suspense } from 'react'
import { Box } from '@fower/react'
import { GoogleOauthButton } from '../RecoveryPhrase/GoogleOauthButton'

export function GoogleBackupOauth() {
  return (
    <Suspense fallback={<Box my2 h10 w-100p border borderStone200 />}>
      <GoogleOauthButton from="backup" />
    </Suspense>
  )
}
