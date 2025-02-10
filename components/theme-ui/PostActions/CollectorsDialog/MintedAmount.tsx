'use client'

import { Dispatch, SetStateAction } from 'react'
import { useSiteContext } from '@/components/SiteContext'
import { Skeleton } from '@/components/ui/skeleton'
import { useCreations } from '@/lib/hooks/useCreations'
import { Post } from '@/lib/theme.types'
import { Bookmark } from 'lucide-react'

interface Props {
  post: Post
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export function MintedAmount({ post, setIsOpen }: Props) {
  const { spaceId } = useSiteContext()
  const { creations = [], isLoading } = useCreations(spaceId!)

  if (isLoading) return <Skeleton className="h-6 w-12" />

  const creation = creations.find(
    (i) => Number(i.creationId) === Number(post.creationId),
  )

  if (!creation) return null

  return (
    <div
      className="flex items-center justify-between text-foreground gap-1 cursor-pointer opacity-70 hover:opacity-100"
      onClick={() => setIsOpen(true)}
    >
      <Bookmark size={20} />
      <div>{creation?.mintedAmount}</div>
    </div>
  )
}
