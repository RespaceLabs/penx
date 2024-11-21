'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {}

export function SpaceNav({}: Props) {
  const pathname = usePathname()

  const Paths = {
    about: `/creator-fi`,
    members: `/creator-fi/members`,
    plans: `/creator-fi/plans`,
    shares: `/creator-fi/contributors`,
    subscriptionRecords: `/creator-fi/subscription-records`,
    funding: `/creator-fi/funding`,
    trade: `/creator-fi/trade`,
    staking: `/creator-fi/staking`,
  }

  const linkClassName = (path: string) =>
    cn(
      'inline-flex item-center justify-center py-1.5 border-b-2 px-3 -mb-[1px] border-transparent',
      path === pathname && 'border-black border-zinc-400',
    )

  return (
    <div className="flex justify-center">
      <Link href={Paths.plans} className={linkClassName(Paths.plans)}>
        Membership
      </Link>

      <Link href={Paths.trade} className={linkClassName(Paths.trade)}>
        Trade
      </Link>

      {/* <Link href={Paths.staking} className={linkClassName(Paths.staking)}>
        Staking
      </Link> */}
    </div>
  )
}
