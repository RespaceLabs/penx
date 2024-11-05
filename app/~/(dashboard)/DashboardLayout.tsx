'use client'

import { ReactNode, useState } from 'react'
import { Sidebar } from '@/app/~/(dashboard)/Sidebar/Sidebar'
import { CreationDialog } from '@/components/CreationDialog/CreationDialog'
import { NavbarWrapper } from '@/components/Navbar/NavbarWrapper'
import { useQueryEthBalance } from '@/hooks/useEthBalance'
import { useQueryEthPrice } from '@/hooks/useEthPrice'
import { SIDEBAR_WIDTH } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSideBarOpen] = useState(true)
  useQueryEthPrice()
  useQueryEthBalance()

  const pathname = usePathname()
  const isNote = pathname.includes('~/notes')

  return (
    <div className="min-h-screen flex relative">
      <div
        className={cn('h-screen sticky top-0')}
        style={{ width: SIDEBAR_WIDTH }}
      >
        <Sidebar />
      </div>
      <div className="flex-1">
        {/* <NavbarWrapper /> */}
        <CreationDialog />
        <div className={cn('pb-20', !isNote && 'mx-auto md:max-w-2xl pt-16', isNote)}>
          {children}
        </div>
      </div>
    </div>
  )
}
