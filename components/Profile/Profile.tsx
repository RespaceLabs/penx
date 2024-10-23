'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { ProfileDialog } from './ProfileDialog/ProfileDialog'
import { ProfilePopover } from './ProfilePopover'

interface Props {}

export function Profile({}: Props) {
  const { data } = useSession()

  const authenticated = !!data

  // if (!authenticated) return <Skeleton className="h-10 w-[100px]" />

  return (
    <>
      <ProfileDialog />
      <WalletConnectButton
        className={cn('rounded-full', authenticated && 'hidden')}
      />

      <ProfilePopover className={cn(!authenticated && 'hidden')} />
    </>
  )
}
