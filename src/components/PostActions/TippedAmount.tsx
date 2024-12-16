'use client'

import { Dispatch, SetStateAction } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { useTipInfo } from '@/hooks/useTipInfo'
import { useTipStats } from '@/hooks/useTipStats'
import { precision } from '@/lib/math'
import { Post } from '@penxio/types'
import { DollarSign } from 'lucide-react'
import { useParams } from 'next/navigation'

interface Props {
  post: Post
  receivers: string[]
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export function TippedAmount(props: Props) {
  const params = useParams()
  const slug = params.slug

  if (slug) {
    return <TippedAmountInPostDetail {...props} />
  }
  return <TippedAmountInHome {...props} />
}

export function TippedAmountInPostDetail({ post, setIsOpen }: Props) {
  const { data, isLoading } = useTipInfo(post.id, true)

  if (isLoading) return <Skeleton className="h-6 w-12" />
  return (
    <div
      className="flex items-center justify-between text-foreground gap-1 cursor-pointer opacity-70 hover:opacity-100"
      onClick={() => setIsOpen(true)}
    >
      <DollarSign size={18} />
      <div> {!data ? '0' : precision.toDecimal(data?.totalAmount)}</div>
    </div>
  )
}

export function TippedAmountInHome({ post, receivers, setIsOpen }: Props) {
  const { data = [], isLoading } = useTipStats(receivers)
  if (isLoading) return <Skeleton className="h-6 w-12" />
  const item = data.find((i) => i.uri === post.id)

  return (
    <div
      className="flex items-center justify-between text-foreground gap-1 cursor-pointer opacity-70 hover:opacity-100"
      onClick={() => setIsOpen(true)}
    >
      {/* <span className="i-[ri--quill-pen-ai-fill]"></span> */}
      <DollarSign size={18} />
      <div> {!data ? '0' : precision.toDecimal(item?.totalAmount)}</div>
    </div>
  )
}
