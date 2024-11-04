'use client'

import { Post } from '@plantreexyz/types'
import { CollectButton } from './Collection/CollectButton'
import { CollectorsDialog } from './CollectorsDialog/CollectorsDialog'
import { MintedAmount } from './MintedAmount'
import { TippedAmount } from './TippedAmount'
import { TipTokenButton } from './TipToken/TipTokenButton'

interface Props {
  post: Post
}

export function PostActions({ post }: Props) {
  return (
    <div className="flex items-center justify-between">
      <CollectorsDialog post={post} />
      <div className="flex items-end gap-4">
        {typeof post.creationId === 'number' && <MintedAmount post={post} />}
        <TippedAmount post={post} />
      </div>
      <div className="flex items-center gap-1">
        {typeof post.creationId === 'number' && <CollectButton post={post} />}
        <TipTokenButton post={post} />
      </div>
    </div>
  )
}
