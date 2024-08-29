import { PropsWithChildren } from 'react'
import { Button } from '@/components/ui/button'
import { fontMapper } from '@/styles/fonts'
import { HomeLayoutProps } from '@/theme-helper/types'
import Image from 'next/image'
import Link from 'next/link'
import { NavName } from './components/NavName'
import { SpaceNav } from './components/SpaceNav'

export function HomeLayout({
  children,
  space,
  path,
}: PropsWithChildren<HomeLayoutProps>) {
  const domain = space.subdomain
  const Paths = {
    home: `/@${domain}`,
    posts: `/@${domain}/posts`,
    members: `/@${domain}/members`,
    about: `/@${domain}/about`,
  }

  return (
    <div className={fontMapper[space.font] + 'pb-20'}>
      <SpaceNav space={space} />

      <div className="flex flex-col md:w-[560px] sm:w-full mx-auto gap-10 pb-4 border-l-4 border-neutral-100">
        <div className="flex items-center justify-between -mt-2">
          <div className="flex gap-2 text-neutral-400 -ml-4">
            <Link
              href={`/@${domain}`}
              className="h-7 w-7 bg-neutral-200 inline-flex items-center justify-center rounded-full"
            >
              <span className="i-[tabler--home-filled] rounded-full text-neutral-400 h-5 w-5"></span>
            </Link>
            <Link href={`/@${domain}`}>
              <NavName pathname={Paths.home}>Posts</NavName>
            </Link>
            <Link href={Paths.members}>
              <NavName pathname={Paths.members}>Members</NavName>
            </Link>
            <Link href={Paths.about}>
              <NavName pathname={Paths.about}>About</NavName>
            </Link>
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full text-neutral-400 flex items-center"
          >
            <Link href={`/~/space/${space.id}`}>
              <span className="i-[token--eth] w-5 h-5"></span>
              <div>Become member</div>
            </Link>
          </Button>
        </div>
        <div className="flex gap-2 items-center -ml-9">
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
            <div className="text-neutral-500">{space.description}</div>
          </div>
        </div>
        <div className="pt-2">{children}</div>
      </div>
    </div>
  )
}
