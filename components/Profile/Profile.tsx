'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { useAddress } from '@/hooks/useAddress'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { ProfileDialog } from './ProfileDialog/ProfileDialog'
import { ProfilePopover } from './ProfilePopover'

interface Props {}

export function Profile({}: Props) {
  const { status } = useSession()
  const {} = useAddress()

  if (status === 'loading') return <Skeleton className="h-10 w-[100px]" />
  const authenticated = status === 'authenticated'
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
