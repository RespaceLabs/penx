import { Logo } from '@/components/Logo'
import { Profile } from '@/components/Profile/Profile'
import { Space } from '@prisma/client'
import Link from 'next/link'

interface Props {
  space: Space
}

export function SpaceNav({ space }: Props) {
  return (
    <div className="bg-white h-[56px] flex items-center justify-between px-3">
      <Link href="/" className="flex items-center justify-center">
        <Logo className="h-7 w-7"></Logo>
      </Link>
      <Profile />
    </div>
  )
}
