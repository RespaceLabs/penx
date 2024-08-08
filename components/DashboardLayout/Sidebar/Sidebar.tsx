'use client'

import { useMemo } from 'react'
import { ProfileDialog } from '@/components/Profile/ProfileDialog/ProfileDialog'
import { ProfilePopover } from '@/components/Profile/ProfilePopover'
import { Separator } from '@/components/ui/separator'
import { useSpaces } from '@/hooks/useSpaces'
import { cn } from '@/lib/utils'
import {
  CircleDollarSign,
  Coffee,
  Github,
  Home,
  Rocket,
  Shell,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChannelList } from './ChannelList'
import { ChannelListHeader } from './ChannelListHeader'
import { PostList } from './PostList'
import { PostListHeader } from './PostListHeader'
import { SpacesSelect } from './SpacesSelect'

export function Sidebar() {
  const pathname = usePathname()
  const { space, spaces } = useSpaces()
  const { data: session } = useSession()

  const tabs = useMemo(() => {
    const list = [
      {
        name: 'Discover',
        href: '/~/discover',
        isActive: pathname === '/~/discover',
        icon: <Shell width={18} />,
      },
      {
        name: 'USDC Faucet',
        href: '/~/faucet',
        isActive: pathname === '/~/faucet',
        icon: <CircleDollarSign width={18} />,
      },
    ]
    if (spaces.length) {
      list.unshift({
        name: 'Home',
        href: `/~`,
        isActive: pathname === `/~`,
        icon: <Home width={18} />,
      })

      if (session?.userId === space.userId) {
        list.push({
          name: 'Sponsor',
          href: '/~/sponsor',
          isActive: pathname === '/~/sponsor',
          icon: <Coffee width={18} />,
        })
      }
    }

    return list
  }, [pathname, space])

  const externalLinks = [
    {
      name: 'Space home',
      href: `/@${space?.subdomain}`,
      icon: <Rocket width={18} />,
    },

    {
      name: 'Star on GitHub',
      href: 'https://github.com/0xzio/penx',
      icon: <Github width={18} />,
    },
  ]

  return (
    <div className="sticky top-0 md:block hidden h-screen md:w-[280px] xl:w-[280px] flex-shrink-0">
      <div className="flex flex-col justify-between min-h-screen">
        <SpacesSelect />
        <div className="p-5 flex flex-col flex-1">
          <div className="flex flex-col gap-2 flex-1">
            <div className="grid gap-1">
              {tabs.map(({ name, href, isActive, icon }) => (
                <Link
                  key={name}
                  href={href}
                  className={cn(
                    'flex items-center gap-2 hover:bg-sidebar py-[6px] px-2 rounded cursor-pointer -mx-2',
                    isActive && 'bg-sidebar',
                  )}
                >
                  {icon}
                  <span className="text-sm font-medium">{name}</span>
                </Link>
              ))}
            </div>
            {space && (
              <>
                <PostListHeader />
                <PostList />
                <ChannelListHeader />
                <ChannelList />
              </>
            )}
          </div>
          <div>
            <div className="grid gap-1">
              {externalLinks.map(({ name, href, icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800"
                >
                  <div className="flex items-center space-x-3">
                    {icon}
                    <span className="text-sm font-medium">{name}</span>
                  </div>
                  <p>↗</p>
                </a>
              ))}
            </div>

            <Separator orientation="horizontal" className="my-1" />

            <ProfileDialog />
            <ProfilePopover showAddress showEnsName />
          </div>
        </div>
      </div>
    </div>
  )
}
