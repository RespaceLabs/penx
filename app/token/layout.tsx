'use client'

import { ReactNode } from 'react'
import { AppProvider } from '@/components/DashboardLayout/AppProvider'
import { DashboardLayout } from '@/components/DashboardLayout/DashboardLayout'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { StoreProvider } from '@/store'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-accent h-screen">
      <div className="flex justify-between items-center p-3">
        <div>logo</div>
        <WalletConnectButton />
      </div>
      {children}
    </div>
  )
}
