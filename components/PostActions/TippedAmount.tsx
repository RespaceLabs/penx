'use client'

import { Dispatch, SetStateAction } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { useTipStats } from '@/hooks/useTipStats'
import { precision } from '@/lib/math'
import { Post } from '@penxio/types'

interface Props {
  post: Post
  receivers: string[]
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export function TippedAmount({ post, receivers, setIsOpen }: Props) {
  const { data = [], isLoading } = useTipStats(receivers)
  if (isLoading) return <Skeleton className="h-6 w-12" />
  const item = data.find((i) => i.uri === post.id)

  return (
    <div
      className="flex items-center justify-between text-foreground gap-1 cursor-pointer opacity-70 hover:opacity-100"
      onClick={() => setIsOpen(true)}
    >
      <span className="i-[ri--quill-pen-ai-fill]"></span>
      <div> {!data ? '0' : precision.toDecimal(item?.totalAmount)}</div>
    </div>
  )
}
