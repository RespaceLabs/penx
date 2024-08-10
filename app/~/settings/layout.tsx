'use client'

import { PropsWithChildren } from 'react'
import { NavbarWrapper } from '@/components/Navbar/NavbarWrapper'
import { useSpaces } from '@/hooks/useSpaces'
import { SettingsNav } from './SettingsNav'

export default function SiteAnalyticsLayout({ children }: PropsWithChildren) {
  const { space } = useSpaces()

  if (!space) return null

  const url = `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/@${space.subdomain}`
  return (
    <div className="">
      <NavbarWrapper>
        <h1 className="font-cal text-lg font-bold ">
          Settings for {space.name}
        </h1>
        <a
          href={
            process.env.NEXT_PUBLIC_VERCEL_ENV
              ? `https://${url}`
              : `http://localhost:3000/@${space.subdomain}`
            // : `http://${space.subdomain}.localhost:3000`
          }
          target="_blank"
          rel="noreferrer"
          className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
        >
          {url} ↗
        </a>
      </NavbarWrapper>
      <div className="flex flex-col gap-6 w-[860px] mx-auto rounded-2xl mt-10">
        <SettingsNav></SettingsNav>
        {children}
      </div>
    </div>
  )
}
