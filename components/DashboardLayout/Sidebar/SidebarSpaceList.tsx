'use client'

import { channelsAtom } from '@/hooks/useChannels'
import { postsAtom } from '@/hooks/usePosts'
import { Space, spaceAtom, useSpace } from '@/hooks/useSpace'
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
  const { spaces } = useSpaces()
  const { space } = useSpace()
  const { setSpaceId } = useSpaceId()

  async function selectSpace(space: Space) {
    const [posts, channels] = await Promise.all([
      api.post.listBySpaceId.query(space.id),
      api.channel.listBySpaceId.query(space.id),
    ])

    localStorage.setItem(SELECTED_SPACE, space.id)
    setSpaceId(space.id)
    store.set(postsAtom, posts)
    store.set(channelsAtom, channels)
    store.set(spaceAtom, { space, isLoading: false })
    push(`/~/space/${space.id}`)
  }

  return (
    <div className="relative grid gap-2 items-center justify-center w-full pb-3">
      {spaces.map((item) => (
        <div
          key={item.id}
          className="w-[60px] flex relative justify-center"
          onClick={() => {
            selectSpace(item)
          }}
        >
          {space?.id === item.id && (
            <div
              className={cn(
                'absolute w-[5px] bg-black left-0 top-1 bottom-1 rounded-tr-lg rounded-br-lg',
              )}
            ></div>
          )}
          <Image
            src={
              item.logo ||
              'https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/JRajRyC-PhBHEinQkupt02jqfKacBVHLWJq7Iy.png'
            }
            alt=""
            width={40}
            height={40}
            className={cn(
              'w-8 h-8 md:w-9 md:h-9 rounded-full hover:rounded-lg cursor-pointer bg-neutral-200 transition-all',
              space?.id === item.id && 'w-9 h-9 md:w-10 md:h-10',
            )}
          />
        </div>
      ))}
    </div>
  )
}
