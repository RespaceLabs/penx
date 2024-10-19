'use client'

import { ReactNode } from 'react'
import { CreationDialog } from '@/components/CreationDialog/CreationDialog'
import { NavbarWrapper } from '@/components/Navbar/NavbarWrapper'
import { useQueryEthBalance } from '@/hooks/useEthBalance'
import { useQueryEthPrice } from '@/hooks/useEthPrice'

export function DashboardLayout({ children }: { children: ReactNode }) {
  useQueryEthPrice()
  useQueryEthBalance()
  return (
    <div className="min-h-screen flex-col justify-center flex relative">
      <NavbarWrapper />
      <CreationDialog />
      <div
        className="flex-1 overflow-x-hidden z-1"
        style={
          {
            // boxShadow: '-10px 0px 15px -5px rgba(0, 0, 0, 0.5)',
          }
        }
      >
        <div className="mx-auto md:max-w-2xl pt-16 pb-20">{children}</div>
      </div>
    </div>
  )
}
