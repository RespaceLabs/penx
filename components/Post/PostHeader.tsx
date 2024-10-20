'use client'

import { Dispatch, SetStateAction } from 'react'
import { Post, updatePostPublishStatus } from '@/hooks/usePost'
import { PostStatus } from '@/lib/constants'
import { ChevronLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { PublishPopover } from './PublishPopover'
import { usePublishPost } from './usePublishPost'

interface PostHeaderProps {
  isSaving: boolean
  post: Post
  setData: Dispatch<SetStateAction<Post>>
}
export function PostHeader({ post, setData, isSaving }: PostHeaderProps) {
  const { isLoading, publishPost } = usePublishPost()

  return (
    <div className="flex items-center space-x-3 justify-between fixed right-0 left-0 top-1 h-12 px-2">
      <Link
        href="/~/posts"
        className="inline-flex w-8 h-8 text-foreground items-center justify-center bg-accent rounded-xl cursor-pointer"
      >
        <ChevronLeft size={20} />
      </Link>
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-accent px-2 py-1 text-sm text-stone-400  dark:text-stone-500">
          {isSaving ? 'Saving...' : 'Saved'}
        </div>
        <PublishPopover
          isPending={isLoading}
          post={post}
          onPublish={async ({ gateType }) => {
            await publishPost(post, gateType)
            setData({
              ...post,
              gateType,
              postStatus: PostStatus.PUBLISHED,
              publishedAt: new Date(),
            })
            updatePostPublishStatus()
          }}
        />
      </div>
    </div>
  )
}
