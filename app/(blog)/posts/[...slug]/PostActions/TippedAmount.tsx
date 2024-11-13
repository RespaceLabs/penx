'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { useTipInfo } from '@/hooks/useTipInfo'
import { precision } from '@/lib/math'
import { Post } from '@penxio/types'
import { useTippersDialog } from './TippersDialog/useCollectorsDialog'

interface Props {
  post: Post
}

export function TippedAmount({ post }: Props) {
  const { setIsOpen } = useTippersDialog()
  const { data, isLoading } = useTipInfo(post.id)
  if (isLoading) return <Skeleton className="h-6 w-12" />

  return (
    <div
      className="flex items-center justify-between text-foreground gap-1 cursor-pointer opacity-70 hover:opacity-100"
      onClick={() => {
        setIsOpen(true)
      }}
    >
      <span className="i-[ri--quill-pen-ai-fill]"></span>
      <div> {!data ? '0' : precision.toDecimal(data?.totalAmount)}</div>
    </div>
  )
}
