'use client'

import { useCreateSpaceDialog } from '@/components/CreateSpaceDialog/useCreateSpaceDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { channelsAtom } from '@/hooks/useChannels'
import { postsAtom } from '@/hooks/usePosts'
import { useSpaceId } from '@/hooks/useSpaceId'
import { useSpaces } from '@/hooks/useSpaces'
import { SELECTED_SPACE } from '@/lib/constants'
import { api } from '@/lib/trpc'
import { cn } from '@/lib/utils'
import { store } from '@/store'
import { ChevronDown, Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export function SpacesSelect() {
  const { push } = useRouter()
  const { space, spaces } = useSpaces()
  const { setSpaceId } = useSpaceId()
  const { setIsOpen } = useCreateSpaceDialog()
  const { data: session } = useSession()

  async function selectSpace(spaceId: string) {
    setSpaceId(spaceId)

    localStorage.setItem(SELECTED_SPACE, spaceId)

    const [posts, channels] = await Promise.all([
      api.post.listBySpaceId.query(spaceId),
      api.channel.listBySpaceId.query(spaceId),
    ])
    store.set(postsAtom, posts)
    store.set(channelsAtom, channels)
    push(`/~/space/${spaceId}`)
  }

  if (!space)
    return (
      <div className="h-[50px] w-full flex items-center justify-center">
        <Button
          size="icon"
          className="rounded-full"
          onClick={() => {
            push(`/~/create-space`)
          }}
        >
          <TooltipProvider delayDuration={10}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center h-full w-full">
                  <Plus size={20} className="inline-flex" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">Create Space</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Button>
      </div>
    )

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center justify-between px-4 hover:bg-sidebar/50 cursor-pointer font-semibold h-12">
            <div className="flex items-center gap-2">
              <Image
                src={space.logo!}
                alt=""
                width={24}
                height={24}
                className="w-6 h-6 rounded-full"
              />

              {/* <div>{space.name}</div> */}
              <ChevronDown size={16} className="text-neutral-600" />
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          alignOffset={10}
          className="w-[260px]"
        >
          {spaces.map((item) => (
            <DropdownMenuItem
              key={item.id}
              className={cn(
                'cursor-pointer flex gap-2 items-center justify-between',
                item.id === space.id && 'bg-muted',
              )}
              onClick={async () => {
                await selectSpace(item.id)
              }}
            >
              <div className="flex items-center gap-2">
                <Image
                  src={item.logo!}
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full"
                />
                <div className="text-base font-semibold">{item.name}</div>
              </div>
              <Badge variant="secondary">
                {session?.userId === item.userId ? 'Owner' : 'Member'}
              </Badge>
            </DropdownMenuItem>
          ))}

          <DropdownMenuItem
            key={space.id}
            className="cursor-pointer flex gap-2 items-center"
            onClick={() => {
              // setIsOpen(true)
              push(`/~/create-space`)
            }}
          >
            <Plus size={24} className="inline-flex" />
            <div className="text-base font-semibold">Create Space</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
