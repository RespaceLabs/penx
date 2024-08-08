'use client'

import { PropsWithChildren } from 'react'
import { useAddress } from '@/hooks/useAddress'
import { useQueryEthBalance } from '@/hooks/useEthBalance'
import { useQueryEthPrice } from '@/hooks/useEthPrice'
import { useQueryUsdcBalance } from '@/hooks/useUsdcBalance'
import { useAccount } from 'wagmi'
import { CreateSpaceDialog } from '../CreateSpaceDialog/CreateSpaceDialog'
import { Sidebar } from './Sidebar/Sidebar'

export function DashboardLayout({ children }: PropsWithChildren) {
  useQueryEthPrice()
  useQueryEthBalance()
  useQueryUsdcBalance()
  useAddress()

  return (
    <div className="mx-auto min-h-full">
      <div className="min-h-screen flex-row justify-center flex">
        <CreateSpaceDialog />
        <Sidebar />
        <div
          className="flex-1 overflow-x-hidden"
          style={
            {
              // boxShadow: '-10px 0px 15px -5px rgba(0, 0, 0, 0.5)',
            }
          }
        >
          {children}
        </div>
      </div>
    </div>
  )
}
