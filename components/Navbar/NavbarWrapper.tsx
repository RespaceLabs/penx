'use client'

import React, { HTMLAttributes, PropsWithChildren, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { Merienda } from 'next/font/google'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ProfilePopover } from '../Profile/ProfilePopover'
import { useSiteContext } from '../SiteContext'
import { WalletConnectButton } from '../WalletConnectButton'
import { NewButton } from './NewButton'

const merienda = Merienda({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

interface Props extends HTMLAttributes<HTMLDivElement> {}
export function NavbarWrapper({
  children,
  ...rest
}: PropsWithChildren & Props) {
  const pathname = usePathname()!
  const { data: session } = useSession()
  const isPost = pathname.startsWith(`/~/post/`)
  const site = useSiteContext()

  const topRightJSX = useMemo(() => {
    if (isPost) return null
    if (!session) return <WalletConnectButton />
    return (
      <div className="flex gap-2">
        <NewButton />
        <ProfilePopover />
      </div>
    )
  }, [session, isPost])

  return (
    <div
      className={cn(
        'h-14 flex items-center justify-between sticky top-0 px-3 border-b bg-background z-50',
        rest.className,
      )}
    >
      <div>
        <Link href="/" className={cn('font-bold text-2xl', merienda.className)}>
          {site.name}
        </Link>
      </div>
      <div className="flex-1"></div>

      {topRightJSX}
    </div>
  )
}
