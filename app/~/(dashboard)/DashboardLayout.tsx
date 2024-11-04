'use client'

import { ReactNode, useState } from 'react'
import { Sidebar } from '@/app/~/(dashboard)/Sidebar'
import { CreationDialog } from '@/components/CreationDialog/CreationDialog'
import { NavbarWrapper } from '@/components/Navbar/NavbarWrapper'
import { useQueryEthBalance } from '@/hooks/useEthBalance'
import { useQueryEthPrice } from '@/hooks/useEthPrice'
import { SIDEBAR_WIDTH } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSideBarOpen] = useState(true)
  useQueryEthPrice()
  useQueryEthBalance()
  return (
    <div className="min-h-screen flex relative">
      <div
        className={cn('h-screen sticky top-0')}
        style={{ width: SIDEBAR_WIDTH }}
      >
        <Sidebar />
      </div>
      <div className="flex-1 bgam">
        <NavbarWrapper />
        <CreationDialog />
        <div className="mx-auto md:max-w-2xl pt-16 pb-20">{children}</div>
      </div>
    </div>
  )
}
