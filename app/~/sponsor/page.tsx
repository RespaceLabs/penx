'use client'

import { NavbarWrapper } from '@/components/Navbar/NavbarWrapper'
import { useSpaces } from '@/hooks/useSpaces'
import { SponsorList } from './SponsorList'

export default function Page() {
  const { space } = useSpaces()

  return (
    <div className="">
      <NavbarWrapper>
        <div className="text-lg font-bold">Sponsors management</div>
      </NavbarWrapper>
    </div>
  )
}
