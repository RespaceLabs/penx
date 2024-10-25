'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { isGoogleOauth } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { Button } from '../ui/button'
import { GoogleOauthButton } from './GoogleOauthButton'
import { GoogleOauthDialog } from './GoogleOauthDialog/GoogleOauthDialog'
import { ProfileDialog } from './ProfileDialog/ProfileDialog'
import { ProfilePopover } from './ProfilePopover'

interface Props {}

export function Profile({}: Props) {
  const { data, status } = useSession()

  if (status == 'loading') return <Skeleton className="h-10 w-[100px]" />

  const authenticated = !!data

  return (
    <>
      <ProfileDialog />
      <GoogleOauthDialog />

      {!authenticated && (
        <>
          {isGoogleOauth && <GoogleOauthButton />}
          {!isGoogleOauth && (
            <WalletConnectButton className={cn('rounded-xl')} />
          )}
        </>
      )}

      {authenticated && <ProfilePopover />}
    </>
  )
}
