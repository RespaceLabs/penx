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
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useMembers } from '@/hooks/useMembers'
import { useAddress } from '@/hooks/useAddress'

export function SidebarSpaceNav() {
  const pathname = usePathname()
  const { space } = useSpace()
  const { data: session } = useSession()
  const { channels } = useChannels()
  const { posts } = usePosts()
  const { members } = useMembers(space.id)
  const address = useAddress()
  const router = useRouter()

  const tabs = useMemo(() => {
    const list = [
      {
        name: `${space?.name} | $${space?.symbolName}` || '',
        href: `/~`,
        isActive: pathname === `/~/space/${space?.id}`,
        icon: (
          <div className="h-full w-full inline-flex relative items-center justify-center">
            <Home size={20} />
            <Image
              src={
                space.logo! ||
                'https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/JRajRyC-PhBHEinQkupt02jqfKacBVHLWJq7Iy.png'
              }
              alt=""
              width={24}
              height={24}
              className="w-6 h-6 rounded-full absolute -right-2 -top-2 bg-white shadow"
            />
          </div>
        ),
      },
      {
        name: 'Posts',
        memberOnly: true,
        href: posts.length
          ? `/~/space/${space.id}/post/${posts[0].id}`
          : `/~/space/${space.id}/create-post`,
        isActive:
          pathname.startsWith(`/~/space/${space.id}/post/`) ||
          pathname === `/~/space/${space.id}/create-post`,
        icon: <FeatherIcon width={20} />,
      },
      {
        name: 'Chat',
        memberOnly: true,
        href: `/~/space/${space.id}/channel/${channels?.[0]?.id}`,
        isActive: pathname.startsWith(`/~/space/${space.id}/channel/`),
        icon: <MessageCircleMore width={20} />,
      },
    ]

    return list
  }, [pathname, space, channels, posts])

  const isMember = useMemo<boolean>(() => {
    if (space.userId === session?.userId) {

      return true // own
    } else {
      const exists = members.some((item) => item?.user?.address === address);
      if (exists) {

        return true
      }

      return false
    }
  }, [members, address])

  return (
    <div className="grid gap-1 items-center justify-center">
      {tabs.map(({ name, href, isActive, icon, memberOnly }) => {
        return <div key={name}
          className={cn(
            'flex hover:bg-sidebar h-10 w-10 rounded-full cursor-pointer bg-accent border border-transparent',
            isActive && (memberOnly && !isMember ? 'bg-sidebar' : 'bg-black/80 text-white hover:bg-black')
          )}
          onClick={async (e) => {
            if (memberOnly && !isMember) {
              toast.info('You must be a member of this space to access this feature.')
              return
            }

            if (posts.length) {
              const post = await api.post.byId.query(posts[0].id)
              store.set(postAtom, post)
            }

            router.push(href)
          }}
        >
          <Content icon={icon} name={name} />
        </div>
      })}
    </div>
  )
}

interface ContentProps {
  icon: React.ReactNode
  name: string
}

function Content({ icon, name }: ContentProps) {
  return (
    <TooltipProvider delayDuration={10}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center justify-center h-full w-full">
            {icon}
          </div>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent side="right">
            {name}
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  )
}
