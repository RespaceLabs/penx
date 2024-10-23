'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
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
      <WalletConnectButton
        className={cn('rounded-full', authenticated && 'hidden')}
      />

      <ProfilePopover className={cn(!authenticated && 'hidden')} />
    </>
  )
}
