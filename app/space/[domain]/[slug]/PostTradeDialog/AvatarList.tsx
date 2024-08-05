'use client'

import { Badge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/UserAvatar'
import { useHolders } from '@/hooks/useHolders'
import { PostWithSpace } from '@/hooks/usePost'
import { cn } from '@/lib/utils'

interface Props {
  post: PostWithSpace
}

export function AvatarList({ post }: Props) {
  const { holders, isLoading } = useHolders(post.id)

  if (isLoading) return null

  return (
    <div className="flex items-center cursor-pointer relative">
      <div className="flex z-1">
        {holders.slice(0, 4).map((item) => (
          <UserAvatar
            key={item.id}
            user={item.user as any}
            className={cn('w-8 h-8 -ml-2 border-2 border-white')}
          />
        ))}
      </div>
      <Badge
        className="-ml-2 z-10 text-neutral-500"
        size="sm"
        variant="secondary"
      >
        {holders.length} holders
      </Badge>
    </div>
  )
}
