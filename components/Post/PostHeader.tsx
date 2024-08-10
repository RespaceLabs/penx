'use client'

import { Dispatch, SetStateAction } from 'react'
import { PostWithSpace, updatePostPublishStatus } from '@/hooks/usePost'
import { ExternalLink } from 'lucide-react'
import { PublishPopover } from './PublishPopover'
import { usePublishPost } from './usePublishPost'

interface PostHeaderProps {
  isSaving: boolean
  post: PostWithSpace
  setData: Dispatch<SetStateAction<PostWithSpace>>
}
export function PostHeader({ post, setData, isSaving }: PostHeaderProps) {
  const url = process.env.NEXT_PUBLIC_VERCEL_ENV
    ? `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/@${post.space?.subdomain}/${post.slug}`
    : `http://localhost:3000/@${post.space?.subdomain}/${post.slug}`

  const { isLoading, publishPost } = usePublishPost()

  return (
    <div className="flex items-center space-x-3 justify-between fixed right-0 top-1 h-12 pr-2">
      <div className="flex items-center gap-2">
        {post.published && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-sm text-stone-400 hover:text-stone-500"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
        <div className="rounded-lg bg-stone-100 px-2 py-1 text-sm text-stone-400 dark:bg-stone-800 dark:text-stone-500">
          {isSaving ? 'Saving...' : 'Saved'}
        </div>
        <PublishPopover
          isPending={isLoading}
          post={post}
          onPublish={async ({ gateType }) => {
            await publishPost(post, gateType)
            setData({ ...post, gateType, published: true })
            updatePostPublishStatus()
          }}
        />
      </div>
    </div>
  )
}
