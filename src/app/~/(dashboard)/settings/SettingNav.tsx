'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {}

export function SettingNav({}: Props) {
  const pathname = usePathname()

  const Paths = {
    general: '/~/settings',
    linkAccounts: '/~/settings/link-accounts',
    appearance: '/~/settings/appearance',
    socials: '/~/settings/socials',
    web3: '/~/settings/web3',
    contributors: '/~/settings/contributors',
  }

  const linkClassName = (path: string) =>
    cn(
      'inline-flex item-center justify-center py-1.5 border-b-2 -mb-[1px] border-transparent flex-shrink-0',
      path === pathname && 'border-black border-zinc-400',
    )

  return (
    <div className="flex border-b gap-8">
      <Link href={Paths.general} className={linkClassName(Paths.general)}>
        General
      </Link>
      <Link href={Paths.appearance} className={linkClassName(Paths.appearance)}>
        Appearance
      </Link>

      <Link
        href={Paths.linkAccounts}
        className={linkClassName(Paths.linkAccounts)}
      >
        Link Accounts
      </Link>
      <Link href={Paths.web3} className={linkClassName(Paths.web3)}>
        Web3
      </Link>
      <Link href={Paths.socials} className={linkClassName(Paths.socials)}>
        Socials
      </Link>
      <Link
        href={Paths.contributors}
        className={linkClassName(Paths.contributors)}
      >
        Contributors
      </Link>
    </div>
  )
}
