import { PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'
import { fontMapper } from '@/styles/fonts'
import { Space } from '@/theme-helper/types'
import Image from 'next/image'
import { SpaceNav } from './components/SpaceNav'

interface HomeLayoutProps {
  space: Space
}

export function HomeLayout({
  children,
  space,
}: PropsWithChildren<HomeLayoutProps>) {
  const domain = space.subdomain
  const Paths = {
    posts: `/@${domain}`,
    members: `/@${domain}/members`,
    sponsors: `/@${domain}/sponsors`,
  }

  const linkClassName = cn(
    'flex flex-col item-center justify-center border-b-2border-transparent text-center gap-2',
  )

  return (
    <div className={fontMapper[space.font]}>
      <SpaceNav space={space} />

      <div className="flex  flex-col min-h-[100vh] md:w-[800px] sm:w-full mx-auto gap-10 pb-20">
        <div className="flex gap-2 items-center">
          <Image
            alt={space.name || ''}
            className="w-16 h-16 rounded-full"
            height={80}
            width={80}
            src={
              space.logo ||
              'https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/JRajRyC-PhBHEinQkupt02jqfKacBVHLWJq7Iy.png'
            }
          />
          <div className="">
            <div className="font-semibold text-2xl">{space.name}</div>
            <div className="text-neutral-600">{space.description}</div>
          </div>
        </div>
        <div className="pt-6">{children}</div>
      </div>
    </div>
  )
}
