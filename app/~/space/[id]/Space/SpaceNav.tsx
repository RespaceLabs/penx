import { Logo } from '@/components/Logo'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { Space } from '@prisma/client'
import Link from 'next/link'

interface Props {
  space: Space
}

export function SpaceNav({ space }: Props) {
  return (
    <div className="border-b h-[56px] flex items-center justify-between px-3">
      <Link href="/" className="flex items-center justify-center">
        <Logo className="w-8 h-8"></Logo>
      </Link>
      <WalletConnectButton />
    </div>
  )
}
