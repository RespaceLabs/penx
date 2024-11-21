'use client'

import { PropsWithChildren, Suspense } from 'react'
import { useQueryEthBalance } from '@/app/(creator-fi)/hooks/useEthBalance'
import { ClientOnly } from '@/components/ClientOnly'
import LoadingCircle from '@/components/icons/loading-circle'
import { Profile } from '@/components/Profile/Profile'
import { SpaceType } from '@/lib/types'
import Link from 'next/link'
import { SpaceBasicInfo } from './Space/SpaceBasicInfo'
import { SpaceNav } from './Space/SpaceNav'

interface HeaderProps {
  space: SpaceType
}
function Header({ space }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between px-4">
      <div className="flex flex-1 items-center gap-2 ">
        <Link
          href="/"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-foreground/5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            // width="1em"
            // height="2em"
            viewBox="0 0 12 24"
            className="h-6"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="m3.343 12l7.071 7.071L9 20.485l-7.778-7.778a1 1 0 0 1 0-1.414L9 3.515l1.414 1.414z"
            ></path>
          </svg>
        </Link>
        <SpaceBasicInfo space={space} />
      </div>
      <SpaceNav />
      <div className="flex flex-1 justify-end">
        <Profile />
      </div>
    </header>
  )
}

interface Props {
  space: SpaceType
}

export function CreatorFiLayout({ children, space }: PropsWithChildren<Props>) {
  useQueryEthBalance()

  return (
    <>
      <Header space={space} />
      {children}
    </>
  )
}
