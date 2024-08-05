import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/UserAvatar'
import { getHomeSpaces } from '@/lib/fetchers'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { LaunchButton } from './LaunchButton'
import { Slogan } from './Slogan'

export default async function HomePage() {
  const spaces = await getHomeSpaces()

  return (
    <div className="flex flex-col justify-center pt-20 gap-8">
      <Slogan></Slogan>
      <div className="text-center h-12">
        <Suspense fallback={''}>
          <LaunchButton />
        </Suspense>
      </div>

      <div className="grid gap-4 mx-auto sm:w-full mt-10 rounded-lg">
        {spaces.map((space, index) => (
          <div
            key={space.id}
            className={cn(
              'flex items-center justify-between p-5 gap-3',
              // spaces.length !== index + 1 && 'border-b border-neutral-100/90',
            )}
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
            <Button asChild size="sm" className="cursor-pointer rounded-xl">
              <a href={`/@${space.subdomain}`} target="_blank">
                Visit space
              </a>
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
