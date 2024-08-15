'use client'

import React, { HTMLAttributes, PropsWithChildren } from 'react'
import { useSpaces } from '@/hooks/useSpaces'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { SpaceMenu } from '../DashboardLayout/Sidebar/SpaceMenu'
import { ProfileDialog } from '../Profile/ProfileDialog/ProfileDialog'
import { ProfilePopover } from '../Profile/ProfilePopover'
import { NewButton } from './NewButton'

interface Props extends HTMLAttributes<any> {}
export function NavbarWrapper({
  children,
  ...rest
}: PropsWithChildren & Props) {
  const pathname = usePathname()
  const isPost = pathname.startsWith('/~/post/')
  const { space, spaces } = useSpaces()
  const { data } = useSession()

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
      {!isPost && (
        <div className="flex gap-2">
          {(space?.userId === data?.userId || !spaces.length) && <NewButton />}
          <ProfilePopover />
        </div>
      )}
    </div>
  )
}
