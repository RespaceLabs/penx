'use client'

import { NavbarWrapper } from '@/components/Navbar/NavbarWrapper'
import { useSpaces } from '@/hooks/useSpaces'
import { EnableSponsorButton } from './EnableSponsorButton'
import { SponsorList } from './SponsorList'

export default function Page() {
  const { space } = useSpaces()

  return (
    <div className="">
      <NavbarWrapper>
        <div className="text-lg font-bold">Sponsors management</div>
      </NavbarWrapper>
      {!space.sponsorCreationId && (
        <div className="flex items-center justify-center h-[80vh]">
          <EnableSponsorButton></EnableSponsorButton>
        </div>
      )}

      <div className="mt-10">{space.sponsorCreationId && <SponsorList />}</div>
    </div>
  )
}
