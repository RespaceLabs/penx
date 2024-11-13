'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { useCreation } from '@/hooks/useCreation'
import { Post } from '@penxio/types'
import { Bookmark } from 'lucide-react'
import { useCollectorsDialog } from './CollectorsDialog/useCollectorsDialog'

interface Props {
  post: Post
}

export function MintedAmount({ post }: Props) {
  const { setIsOpen } = useCollectorsDialog()
  const { creation, isLoading } = useCreation(post.creationId.toString())
  if (isLoading) return <Skeleton className="h-6 w-12" />

  return (
    <div
      className="flex items-center justify-between text-foreground gap-1 cursor-pointer opacity-70 hover:opacity-100"
      onClick={() => {
        setIsOpen(true)
      }}
    >
      <Bookmark size={20} />
      <div>{creation?.mintedAmount}</div>
    </div>
  )
}
