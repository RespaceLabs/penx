'use client'

import { useTipStats } from '@/hooks/useTipStats'
import { Post } from '@penxio/types'
import { CollectButton } from './Collection/CollectButton'
import { CollectorsDialog } from './CollectorsDialog/CollectorsDialog'
import { CommentSheet } from './Comment/CommentSheet'
import { TippersDialog } from './TippersDialog/TippersDialog'
import { TipTokenButton } from './TipToken/TipTokenButton'

interface Props {
  post: Post
  receivers: string[]
}

export function PostActions({ post, receivers }: Props) {
  const { data } = useTipStats(receivers)

  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-end gap-4">
        <CollectorsDialog post={post} />
        <TippersDialog post={post} receivers={receivers} />
        <CommentSheet post={post} />
      </div>
      <div className="flex items-center gap-1">
        <TipTokenButton post={post} receivers={receivers} />
        {typeof post.creationId === 'number' && <CollectButton post={post} />}
      </div>
    </div>
  )
}
