'use client'

import { Badge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/UserAvatar'
import { PostWithSpace } from '@/hooks/usePost'
import { usePostTrades } from '@/hooks/usePostTrades'
import { precision } from '@/lib/math'
import { cn, shortenAddress } from '@/lib/utils'

interface Props {
  post: PostWithSpace
}

export function PostTradeList({ post }: Props) {
  return <div className="space-y-3 mt-4"></div>
}
