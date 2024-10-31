'use client'

import { Skeleton } from '@/components/ui/skeleton'
import {
  PrivyConnectButton,
  ReownConnectButton,
  WalletConnectButton,
} from '@/components/WalletConnectButton'
import { cn } from '@/lib/utils'
import { AuthType } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useAccount } from 'wagmi'
import { GoogleOauthButton } from '../GoogleOauthButton'
import { useSiteContext } from '../SiteContext'
import { GoogleOauthDialog } from './GoogleOauthDialog/GoogleOauthDialog'
import { ProfileDialog } from './ProfileDialog/ProfileDialog'
import { ProfilePopover } from './ProfilePopover'

interface Props {}

export function Profile({}: Props) {
  const { data, status } = useSession()
  const { address = '' } = useAccount()
  const site = useSiteContext()

  if (status === 'loading') return <Skeleton className="h-10 w-[100px]" />

  const authenticated = !!data && address
  const isGoogleOauth = site.authType === AuthType.GOOGLE

  return (
    <>
      <ProfileDialog />
      <GoogleOauthDialog />

      {!authenticated && (
        <>
          {isGoogleOauth && <GoogleOauthButton />}
          {site.authType === AuthType.REOWN && <ReownConnectButton />}
          {site.authType === AuthType.PRIVY && <PrivyConnectButton />}
        </>
      )}

      {authenticated && <ProfilePopover />}
    </>
  )
}
