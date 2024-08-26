import { PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'
import { fontMapper } from '@/styles/fonts'
import { Space } from '@/theme-helper/types'
import Link from 'next/link'
import { ActiveLinkBorder } from './components/ActiveLinkBorder'
import { SpaceNav } from './components/SpaceNav'
import { SpaceSidebar } from './components/SpaceSidebar'

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
      <div className="flex justify-center min-h-[100vh] md:w-[1200px] sm:w-full mx-auto gap-10 pb-20">
        <div className="flex-1 min-h-[100vh] mt-10 pr-8">
          <div className="text-4xl font-semibold mb-10">{space.name}</div>
          <div className="border-b flex items-center gap-6">
            <Link href={Paths.posts} className={linkClassName}>
              <div>Posts</div>
              <ActiveLinkBorder pathname={Paths.posts} />
            </Link>
            <Link href={Paths.members} className={linkClassName}>
              <div>Members</div>
              <ActiveLinkBorder pathname={Paths.members} />
            </Link>
            {/* {data.sponsorCreationId && (
              <Link href={Paths.sponsors} className={linkClassName}>
                <div>Sponsors</div>
                <ActiveLinkBorder pathname={Paths.sponsors} />
              </Link>
            )} */}
          </div>

          <div className="pt-10">{children}</div>
        </div>
        <SpaceSidebar space={space} />
      </div>
    </div>
  )
}
