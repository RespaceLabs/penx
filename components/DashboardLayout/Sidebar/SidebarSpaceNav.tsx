'use client'

import { useMemo } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useChannels } from '@/hooks/useChannels'
import { postAtom } from '@/hooks/usePost'
import { usePosts } from '@/hooks/usePosts'
import { useSpace } from '@/hooks/useSpace'
import { api } from '@/lib/trpc'
import { cn } from '@/lib/utils'
import { store } from '@/store'
import { TooltipPortal } from '@radix-ui/react-tooltip'
import { FeatherIcon, Home, MessageCircleMore } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function SidebarSpaceNav() {
  const pathname = usePathname()
  const { space } = useSpace()
  const { channels } = useChannels()
  const { posts } = usePosts()

  const tabs = useMemo(() => {
    const list = [
      {
        name: 'Home',
        href: `/~`,
        isActive: pathname === `/~/space/${space?.id}`,
        icon: <Home width={20} />,
      },
      {
        name: 'Posts',
        href: posts.length
          ? `/~/space/${space.id}/post/${posts[0].id}`
          : '/~/space/${space.id}/create-post',
        isActive:
          pathname.startsWith('/~/space/${space.id}/post/') ||
          pathname === '/~/space/${space.id}/create-post',
        icon: <FeatherIcon width={20} />,
      },
      {
        name: 'Chat',
        href: `/~/space/${space.id}/channel/${channels?.[0]?.id}`,
        isActive: pathname.startsWith('/~/space/${space.id}/channel/'),
        icon: <MessageCircleMore width={20} />,
      },
      // {
      //   name: 'Space Token',
      //   href: '/~/token',
      //   isActive: pathname === '/~/token',
      //   icon: <span className="i-[formkit--ethereum] w-7 h-7"></span>,
      // },
    ]

    return list
  }, [pathname, space, channels, posts])

  return (
    <div className="grid gap-1 items-center justify-center">
      {tabs.map(({ name, href, isActive, icon }) => (
        <Link
          key={name}
          href={href}
          className={cn(
            'flex hover:bg-sidebar h-10 w-10 rounded-full cursor-pointer',
            isActive && 'bg-sidebar',
          )}
          onClick={async () => {
            if (posts.length) {
              const post = await api.post.byId.query(posts[0].id)
              store.set(postAtom, post)
            }
          }}
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
  )
}
