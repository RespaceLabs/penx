'use client'

import { NavbarWrapper } from '@/components/Navbar/NavbarWrapper'
import { CreateFirstPostButton } from './CreateFirstPostButton'

export default function Page() {
  return (
    <div className="">
      <NavbarWrapper>
        <div className="text-lg font-bold">Create Fist Post</div>
      </NavbarWrapper>

      <div className="h-[80vh] text-center flex flex-col justify-center">
        <div className="space-y-2">
          <div className="text-neutral-400 text-lg">No post yet!</div>
          <CreateFirstPostButton />
        </div>
      </div>
    </div>
  )
}
