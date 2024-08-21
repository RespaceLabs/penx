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
      <div className="flex lg:flex-row flex-col-reverse w-full sm:w-full xl:w-[1200px]  mx-auto gap-12 mt-10 p-3 lg:p-0">
        <div className="flex flex-col gap-6 md:flex-1 rounded-2xl w-full md:w-auto">
          <SpaceInfo />
          {children}
        </div>

        <div className="flex flex-col w-full lg:w-[360px] flex-shrink-0">
          <Transaction />
          <div className="mt-8 lg:block">
            <div className="text-base font-bold">Trades</div>
            <TradeList />
          </div>
        </div>
      </div>
    </div>
  )
}
