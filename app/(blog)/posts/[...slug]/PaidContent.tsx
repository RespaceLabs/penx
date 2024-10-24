'use client'

import { SubscriptionInSession } from '@/lib/types'
import { TipTapNode } from '@plantreexyz/types'
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
  const node: TipTapNode = JSON.parse(post.content || '{}')
  if (!isGated) return node
  const len = node.content?.length || 0
  node.content = node.content?.slice(1, parseInt((len * 0.3) as any)) || []
  return node
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
      <div className="">
        <PostDetail
          post={{
            ...post,
            content: getContent(post, true),
            readingTime: readingTime(post.content),
          }}
          readable={false}
          // MintPost={MintPost}
          next={next}
          prev={prev}
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
        // MintPost={MintPost}
        next={next}
        prev={prev}
      />
      {!hasMembership && (
        <div className="mx-auto relative">
          <GateCover slug={post.slug} />
        </div>
      )}
    </div>
  )
}
