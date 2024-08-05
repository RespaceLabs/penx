'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from '@/components/UserAvatar'
import { trpc } from '@/lib/trpc'
import { cn, getEnsAvatar } from '@/lib/utils'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export function SpaceList() {
  const { push } = useRouter()
  const { data = [], isLoading } = trpc.space.discoverSpaces.useQuery()

  if (isLoading) {
    return (
      <div className="grid gap-4 mx-auto w-[800x] md:w-[800px] sm:w-full mt-6">
        {Array(5)
          .fill('')
          .map((_, i) => (
            <Skeleton key={i} className="h-[100px] rounded-lg" />
          ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 mx-auto w-[800x] md:w-[800px] sm:w-full mt-6">
      {data.map((space) => (
        <div
          key={space.id}
          className="flex items-center justify-between rounded-lg p-5 gap-3 cursor-pointer"
          onClick={() => {
            push(`/~/space/${space.id}`)
          }}
        >
          <div className="flex items-center gap-2">
            <Image
              src={space.logo!}
              alt=""
              width={48}
              height={48}
              className="w-12 h-12 rounded-lg"
            />
            <div>
              <div className="flex items-center gap-1">
                <div className="text-xl font-semibold mr-3">{space.name}</div>
              </div>
              <div className="text-neutral-700 text-sm">
                {space.description || 'No description yet!'}
              </div>

              <div className="flex items-center gap-3">
                <div className="text-xs text-neutral-500">{10} members</div>
                <div className="text-xs text-neutral-500">{0} sponsors</div>
                <div className="flex gap-1">
                  {space.members.map((item) => (
                    <UserAvatar
                      key={item.id}
                      user={item.user as any}
                      className={cn('w-5 h-5')}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Button size="sm" className="">
            Visit space
          </Button>
        </div>
      ))}
    </div>
  )
}
