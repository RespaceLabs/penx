'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface Props {}

export function SettingNav({}: Props) {
  const pathname = usePathname()

  const Paths = {
    general: '/~/settings',
    features: '/~/settings/features',
    linkAccounts: '/~/settings/link-accounts',
    appearance: '/~/settings/appearance',
    socials: '/~/settings/socials',
    tags: '/~/settings/tags',
    web3: '/~/settings/web3',
    contributors: '/~/settings/contributors',
  }

  const linkClassName = (path: string) =>
    cn(
      'inline-flex item-center justify-center md:justify-start py-1.5 border-b-2 md:border-none -mb-[1px] border-transparent flex-shrink-0 text-foreground/60 hover:text-foreground hover:border-foreground/40',
      path === pathname && 'border-foreground/40',
      path === pathname && 'text-foreground font-bold',
    )

  return (
    <div className="flex flex-row md:flex-col border-b md:border-none gap-x-8 overflow-x-auto overflow-y-hidden -mx-3 px-3 md:w-[240px]">
      <Link href={Paths.general} className={linkClassName(Paths.general)}>
        General
      </Link>
      <Link href={Paths.features} className={linkClassName(Paths.features)}>
        Features
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
      <Link href={Paths.tags} className={linkClassName(Paths.tags)}>
        Tags
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
