'use client'

import { NavbarWrapper } from '@/components/Navbar/NavbarWrapper'
import { SpaceList } from './SpaceList'

export default function Page() {
  return (
    <div className="">
      <NavbarWrapper>
        <div className="text-lg font-bold">Discover</div>
      </NavbarWrapper>
      <SpaceList></SpaceList>
    </div>
  )
}
