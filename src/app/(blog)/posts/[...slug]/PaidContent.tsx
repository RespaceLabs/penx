'use client'

import { ContentRender } from '@/components/ContentRender/ContentRender'
import { PostActions } from '@/components/PostActions/PostActions'
import { SubscriptionInSession } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Post } from '@prisma/client'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import readingTime from 'reading-time'
import { GateCover } from './GateCover'

const PostDetail: any = dynamic(
  () => import(process.env.NEXT_PUBLIC_THEME!).then((mod) => mod.PostDetail),
  { ssr: false },
)

function getContent(post: Post, isGated = false) {
  let content = JSON.parse(post.content || '{}')
  if (!isGated) return content
  const len = content?.length || 0
  const index = len < 6 ? 2 : 4
  content = content?.slice(0, index) || []
  return content
}

function checkMembership(subscriptions: SubscriptionInSession[]) {
  if (!Array.isArray(subscriptions)) return false
  if (!subscriptions.length) return false
  const subscription = subscriptions[0]
  if (Date.now() / 1000 < subscription.startTime + subscription.duration) {
    return true
  }
  return false
}

interface Props {
  postId: string
  post: Post
  prev: Post
  next: Post
}

export function PaidContent({ postId, post, next, prev }: Props) {
  const { data: session, status } = useSession()

  if (status === 'loading') return null

  /**  not login */
  if (!session) {
    return (
      <div>
        <PostDetail
          post={{
            ...post,
            content: getContent(post, true),
            readingTime: readingTime(post.content),
          }}
          readable={false}
          next={next}
          prev={prev}
          PostActions={PostActions}
          ContentRender={ContentRender}
          className="min-h-[auto]"
        />

        <div className="mx-auto relative">
          <GateCover slug={post.slug} />
        </div>
      </div>
    )
  }

  const hasMembership = checkMembership(session.subscriptions)

  return (
    <div className="">
      <PostDetail
        post={{
          ...post,
          content: hasMembership ? getContent(post) : getContent(post, true),
          readingTime: readingTime(post.content),
        }}
        readable={hasMembership}
        next={next}
        prev={prev}
        PostActions={PostActions}
        ContentRender={ContentRender}
        className={cn(!hasMembership && 'min-h-[auto]')}
      />
      {!hasMembership && (
        <div className="mx-auto relative">
          <GateCover slug={post.slug} />
        </div>
      )}
    </div>
  )
}
