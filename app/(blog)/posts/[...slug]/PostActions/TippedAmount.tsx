'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useCreation } from '@/hooks/useCreation'
import { useTipInfo } from '@/hooks/useTipInfo'
import { precision } from '@/lib/math'
import { Post } from '@penxio/types'
import { Bookmark, TreeDeciduousIcon } from 'lucide-react'

interface Props {
  post: Post
}

export function TippedAmount({ post }: Props) {
  // const { setIsOpen } = useCollectorsDialog()
  const { data, isLoading } = useTipInfo(post.id)

  if (isLoading) return <Skeleton />

  return (
    <div
      className="flex items-center justify-between text-foreground gap-1 cursor-pointer opacity-70 hover:opacity-100"
      onClick={() => {
        // setIsOpen(true)
      }}
    >
      <TreeDeciduousIcon size={20} />
      <div> {!data ? '0' : precision.toDecimal(data?.totalAmount)}</div>
    </div>
  )
}
