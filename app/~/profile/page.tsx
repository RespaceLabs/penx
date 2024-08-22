'use client'

import { NavbarWrapper } from '@/components/Navbar/NavbarWrapper'
import { useSpace } from '@/hooks/useSpace'
import { SpaceInfo } from '../space/[id]/Space/SpaceInfo'

export default function Page() {
  const { space } = useSpace()
  return (
    <div>
      <NavbarWrapper>
        <div className="text-lg font-bold">Overview</div>
      </NavbarWrapper>
      <div className="flex flex-col gap-6 w-[860px] mx-auto rounded-2xl mt-10">
        <SpaceInfo />
      </div>
    </div>
  )
}
