'use client'

import { PropsWithChildren, Suspense } from 'react'
import { useQueryEthBalance } from '@/app/(creator-fi)/hooks/useEthBalance'
import { useQueryEthPrice } from '@/app/(creator-fi)/hooks/useEthPrice'
import { useQuerySpace, useSpace } from '@/app/(creator-fi)/hooks/useSpace'
import { ClientOnly } from '@/components/ClientOnly'
import LoadingCircle from '@/components/icons/loading-circle'
import { Profile } from '@/components/Profile/Profile'
import Link from 'next/link'
import { SpaceBasicInfo } from './Space/SpaceBasicInfo'
import { SpaceNav } from './Space/SpaceNav'

interface HeaderProps {
  isLoading: boolean
}
function Header({ isLoading }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between px-4">
      <div className="flex flex-1 items-center gap-2 ">
        <Link
          href="/"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-neutral-100 dark:bg-zinc-800/80"
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
        {isLoading && <div>Loading..</div>}
        {!isLoading && <SpaceBasicInfo />}
      </div>
      <SpaceNav></SpaceNav>
      <div className="flex flex-1 justify-end">
        <Profile />
      </div>
    </header>
  )
}

export function CreatorFiLayout({ children }: PropsWithChildren) {
  useQueryEthPrice()
  useQueryEthBalance()
  useQuerySpace()
  const { space } = useSpace()

  if (!space?.address) {
    return (
      <>
        <Header isLoading />
        <div className="flex h-[80vh] items-center justify-center">
          <LoadingCircle />
        </div>
      </>
    )
  }

  return (
    <>
      <Header isLoading={false} />
      {children}
    </>
  )
}
