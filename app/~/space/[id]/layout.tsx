'use client'

import { ReactNode } from 'react'
import { NavbarWrapper } from '@/components/Navbar/NavbarWrapper'
import { useSpace } from './hooks/useSpace'
import { SpaceInfo } from './Space/SpaceInfo'

export default function Layout({ children }: { children: ReactNode }) {
  const { space, isLoading } = useSpace()

  return (
    <div>
      <NavbarWrapper className="gap-1">
        <div className="text-lg font-bold">Space</div>
      </NavbarWrapper>
      <div className="flex flex-col gap-6 w-[860px] mx-auto rounded-2xl mt-10">
        <SpaceInfo space={space} isLoading={isLoading} />
        {children}
      </div>
    </div>
  )
}
