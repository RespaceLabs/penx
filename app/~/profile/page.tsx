'use client'

import { NavbarWrapper } from '@/components/Navbar/NavbarWrapper'
import { useSpaces } from '@/hooks/useSpaces'
import { SpaceInfo } from '../space/[id]/Space/SpaceInfo'

export default function Page() {
  const { space } = useSpaces()
  return (
    <div className="">
      <NavbarWrapper>
        <div className="text-lg font-bold">Overview</div>
      </NavbarWrapper>
      <div className="flex flex-col gap-6 w-[860px] mx-auto rounded-2xl mt-10">
        <SpaceInfo space={space} isLoading={false} />
      </div>
    </div>
  )
}
