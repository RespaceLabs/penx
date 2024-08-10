'use client'

import { NavbarWrapper } from '@/components/Navbar/NavbarWrapper'
import { Faucet } from './Faucet'

export default function Page() {
  return (
    <div className="">
      <NavbarWrapper>
        <div className="text-lg font-bold">USDC Faucet</div>
      </NavbarWrapper>
      <div className="p4 flex flex-col items-center justify-center h-[80vh]">
        <Faucet />
      </div>
    </div>
  )
}
