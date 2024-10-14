'use client'

import { PropsWithChildren } from 'react'
import { useQueryEthBalance } from '@/hooks/useEthBalance'
import { useQueryEthPrice } from '@/hooks/useEthPrice'
import { CreationDialog } from '../CreationDialog/CreationDialog'
import { NavbarWrapper } from '../Navbar/NavbarWrapper'
import { NewButton } from '../Navbar/NewButton'

export function DashboardLayout({ children }: PropsWithChildren) {
  useQueryEthPrice()
  useQueryEthBalance()

  return (
    <div className="min-h-screen flex-col justify-center flex relative">
      <NavbarWrapper></NavbarWrapper>
      <CreationDialog />
      <div
        className="flex-1 overflow-x-hidden z-1"
        style={
          {
            // boxShadow: '-10px 0px 15px -5px rgba(0, 0, 0, 0.5)',
          }
        }
      >
        {children}
      </div>
    </div>
  )
}
