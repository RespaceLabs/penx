'use client'

import { NavbarWrapper } from '@/components/Navbar/NavbarWrapper'
import { useSpace } from '@/hooks/useSpace'

export default function Page() {
  const { space } = useSpace()

  return (
    <div>
      <NavbarWrapper>
        <div className="text-lg font-bold">Sponsors management</div>
      </NavbarWrapper>
    </div>
  )
}
