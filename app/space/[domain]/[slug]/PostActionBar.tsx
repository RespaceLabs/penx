'use client'

import { PostWithSpace } from '@/hooks/usePost'
import { Space } from '@prisma/client'
import { BookmarkPlus, KeyIcon } from 'lucide-react'
import { BuyPostButton } from './BuyPostButton'
import { SellPostButton } from './SellPostButton'

interface Props {
  post: PostWithSpace
}

export function PostActionBar({ post }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-6  text-neutral-600">
        <div className="flex items-center gap-1">
          <span className="inline-flex i-[ph--hands-clapping-light] w-5 h-5"></span>
          <span className="inline-flex -mb-[2px]">10</span>
        </div>

        <div className="flex items-center gap-[2px]">
          <span className="i-[ep--key] w-5 h-5"></span>
          <span>15</span>
        </div>
      </div>
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="inline-flex text-neutral-600 mr-2">
          <span className="i-[carbon--bookmark-add] w-6 h-6"></span>
        </div>
        <SellPostButton space={post.space as any} />
        <BuyPostButton space={post.space as any} />
      </div>
    </div>
  )
}
