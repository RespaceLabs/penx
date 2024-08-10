'use client'

import { useMemo } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useChannels } from '@/hooks/useChannels'
import { usePosts } from '@/hooks/usePosts'
import { useSpaces } from '@/hooks/useSpaces'
import { cn } from '@/lib/utils'
import { TooltipPortal } from '@radix-ui/react-tooltip'
import {
  CircleDollarSign,
  Coffee,
  Compass,
  FeatherIcon,
  Github,
  Home,
  MessageCircleMore,
  Rocket,
  Settings,
  Shell,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SidebarSpaceList } from './SidebarSpaceList'
import { SpaceMenu } from './SpaceMenu'

export function Sidebar() {
  const pathname = usePathname()
  const { space, spaces } = useSpaces()
  const { data: session } = useSession()
  const { channels } = useChannels()
  const { posts } = usePosts()

  const tabs = useMemo(() => {
    const list = [
      {
        name: 'Discover',
        href: '/~/discover',
        isActive: pathname === '/~/discover',
        icon: <Compass width={18} />,
      },
    ]
    if (spaces.length) {
      list.unshift({
        name: 'Home',
        href: `/~`,
        isActive: pathname === `/~/space/${space?.id}`,
        icon: <Home width={18} />,
      })

      list.push({
        name: 'Posts',
        href: posts.length ? `/~/post/${posts[0].id}` : '/~/create-post',
        isActive:
          pathname.startsWith('/~/post/') || pathname === '/~/create-post',
        icon: <FeatherIcon width={18} />,
      })

      list.push({
        name: 'Chat',
        href: `/~/channel/${channels?.[0]?.id}`,
        isActive: pathname.startsWith('/~/channel/'),
        icon: <MessageCircleMore width={18} />,
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

    list.push({
      name: 'USDC Faucet',
      href: '/~/faucet',
      isActive: pathname === '/~/faucet',
      icon: <CircleDollarSign width={18} />,
    })

    return list
  }, [pathname, space, session?.userId, spaces.length, channels, posts])

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
    <div className="sticky top-0 md:block hidden h-screen md:w-[60px] xl:w-[60px] flex-shrink-0 pt-1 z-1000">
      <div className="flex flex-col justify-between min-h-screen">
        <div className="flex flex-col flex-1">
          <div className="flex flex-col gap-2 flex-1">
            <div className="grid gap-1 items-center justify-center">
              {tabs.map(({ name, href, isActive, icon }) => (
                <Link
                  key={name}
                  href={href}
                  className={cn(
                    'flex hover:bg-sidebar h-10 w-10 rounded-full cursor-pointer',
                    isActive && 'bg-sidebar',
                  )}
                >
                  <TooltipProvider delayDuration={10}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-center h-full w-full">
                          {icon}
                        </div>
                      </TooltipTrigger>
                      <TooltipPortal>
                        <TooltipContent side="right" className="">
                          {name}
                        </TooltipContent>
                      </TooltipPortal>
                    </Tooltip>
                  </TooltipProvider>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-1 items-center justify-center pb-2">
            {session?.userId === space?.userId && (
              <Link
                href="/~/settings"
                className={cn(
                  'flex items-center justify-center hover:bg-sidebar h-10 w-10 rounded-full cursor-pointer',
                  pathname === '/~/settings' && 'bg-sidebar',
                )}
              >
                <TooltipProvider delayDuration={10}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-center h-full w-full">
                        <Settings width={18} />
                      </div>
                    </TooltipTrigger>
                    <TooltipPortal>
                      <TooltipContent side="right">
                        Space settings
                      </TooltipContent>
                    </TooltipPortal>
                  </Tooltip>
                </TooltipProvider>
              </Link>
            )}

            {externalLinks.map(({ name, href, icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center hover:bg-sidebar h-10 w-10 rounded-full cursor-pointer"
              >
                <TooltipProvider delayDuration={10}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-center h-full w-full">
                        {icon}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">{name}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </a>
            ))}
          </div>
          <SidebarSpaceList />
        </div>
      </div>
    </div>
  )
}
