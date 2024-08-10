'use client'

import { channelsAtom } from '@/hooks/useChannels'
import { postsAtom } from '@/hooks/usePosts'
import { useSpaceId } from '@/hooks/useSpaceId'
import { useSpaces } from '@/hooks/useSpaces'
import { SELECTED_SPACE } from '@/lib/constants'
import { api } from '@/lib/trpc'
import { cn } from '@/lib/utils'
import { store } from '@/store'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export function SidebarSpaceList() {
  const { push } = useRouter()
  const { space, spaces } = useSpaces()
  const { setSpaceId } = useSpaceId()

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

  return (
    <div className="relative grid gap-2 items-center justify-center w-full pb-3">
      {spaces.map((item) => (
        <div
          key={item.id}
          className="w-[60px] flex relative justify-center"
          onClick={() => {
            selectSpace(item.id)
          }}
        >
          {space.id === item.id && (
            <div
              className={cn(
                'absolute w-[5px] bg-black left-0 top-1 bottom-1 rounded-tr-lg rounded-br-lg',
              )}
            ></div>
          )}
          <Image
            src={item.logo!}
            alt=""
            width={40}
            height={40}
            className={cn(
              'w-9 h-9 rounded-full hover:rounded-lg cursor-pointer bg-neutral-200 transition-all',
              space.id === item.id && 'w-10 h-10',
            )}
          />
        </div>
      ))}
    </div>
  )
}
