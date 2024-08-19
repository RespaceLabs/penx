'use client'

import React, { HTMLAttributes, PropsWithChildren, useMemo } from 'react'
import { useSpace } from '@/hooks/useSpace'
import { useSpaces } from '@/hooks/useSpaces'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useAccount } from 'wagmi'
import { SpaceMenu } from '../DashboardLayout/Sidebar/SpaceMenu'
import { ProfileDialog } from '../Profile/ProfileDialog/ProfileDialog'
import { ProfilePopover } from '../Profile/ProfilePopover'
import { WalletConnectButton } from '../WalletConnectButton'
import { NewButton } from './NewButton'

interface Props extends HTMLAttributes<any> {}
export function NavbarWrapper({
  children,
  ...rest
}: PropsWithChildren & Props) {
  const pathname = usePathname()
  const { space } = useSpace()
  const { spaces } = useSpaces()
  const { data: session } = useSession()
  const isPost = pathname.startsWith(`/~/space/${space?.id}/post/`)
  const { address } = useAccount()
  // console.log('======address:', address)

  const topRightJSX = useMemo(() => {
    if (isPost) return null
    if (!session) return <WalletConnectButton />
    return (
      <div className="flex gap-2">
        <NewButton />
        <ProfilePopover />
      </div>
    )
  }, [session, isPost, spaces, space])

  return (
    <div
      className={cn(
        'h-12 flex items-center justify-between pr-2 sticky top-0 bg-white',
        rest.className,
      )}
    >
      <SpaceMenu />

      <div className="flex-1">{children}</div>

      <ProfileDialog />
      {topRightJSX}
    </div>
  )
}
