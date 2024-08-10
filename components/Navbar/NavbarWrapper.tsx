'use client'

import React, { HTMLAttributes, PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'
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

  return (
    <div
      className={cn(
        'h-12 flex items-center justify-between pr-2 gap-2 sticky top-0',
        rest.className,
      )}
    >
      <SpaceMenu />

      <div>{children}</div>

      <ProfileDialog />
      {!isPost && (
        <div className="flex gap-2">
          <NewButton />
          <ProfilePopover />
        </div>
      )}
    </div>
  )
}
