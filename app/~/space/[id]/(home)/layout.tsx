'use client'

import { ReactNode } from 'react'
import { NavbarWrapper } from '@/components/Navbar/NavbarWrapper'
import { useChainSpace, useQueryChainSpace } from '@/hooks/useChainSpace'
import { SpaceInfo } from '../Space/SpaceInfo'
import { TradeList } from '../Space/TradeList'
import { Transaction } from '../Transaction'

export default function Layout({ children }: { children: ReactNode }) {
  const { space } = useChainSpace()

  if (!space) return null

  return (
    <div className="">
      <NavbarWrapper className="gap-1"></NavbarWrapper>
      <div className="flex flex-1 w-[1200px] mx-auto gap-10 mt-10">
        <div className="flex flex-col gap-6 flex-1 rounded-2xl">
          <SpaceInfo />
          {children}
        </div>

        <div className="w-[360px]">
          <Transaction />
          <div className="text-base font-bold mt-8">Trades</div>
          <TradeList />
        </div>
      </div>
    </div>
  )
}
