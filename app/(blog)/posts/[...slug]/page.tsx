import { authOptions } from '@/lib/auth'
import { GateType } from '@/lib/constants'
import { getPost, getPosts } from '@/lib/fetchers'
import { getSession } from '@/lib/getSession'
import { loadTheme } from '@/lib/loadTheme'
import { SubscriptionInSession } from '@/lib/types'
import { TipTapNode } from '@plantreexyz/types'
import { Post } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { cookies, headers } from 'next/headers'
import { notFound } from 'next/navigation'
import readingTime from 'reading-time'
import { GateCover } from './GateCover'

function checkMembership(subscriptions: SubscriptionInSession[]) {
  if (!Array.isArray(subscriptions)) return false
  if (!subscriptions.length) return false
  const subscription = subscriptions[0]
  if (Date.now() / 1000 < subscription.startTime + subscription.duration) {
    return true
  }
  return false
}

function getContent(post: Post, isGated = false) {
  const node: TipTapNode = post.content as any
  if (!isGated) return node
  const len = node.content?.length || 0
  node.content = node.content?.slice(1, parseInt((len * 0.4) as any)) || []
  return node
}

// export const dynamic = 'force-static'
export const revalidate = 3600 * 24

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: [post.slug] }))
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  const slug = decodeURI(params.slug.join('/'))
  const [post, posts] = await Promise.all([getPost(slug), getPosts()])

  const session = await getSession()
  const postIndex = posts.findIndex((p) => p.slug === slug)
  if (postIndex === -1 || !post) {
    return notFound()
  }

  const prev = posts[postIndex + 1]
  const next = posts[postIndex - 1]

  const { PostDetail } = await loadTheme()
  if (!PostDetail) throw new Error('Missing PostDetail component')

  /** No gated */
  if (post?.gateType == GateType.FREE) {
    return (
      <PostDetail
        post={{
          ...post,
          content: getContent(post),
          readingTime: readingTime(JSON.stringify(post?.content)),
        }}
        // MintPost={MintPost}
        readable
        next={next}
        prev={prev}
      />
    )
  }

  /** gated but not login */
  if (!session) {
    return (
      <div className="">
        <PostDetail
          post={{
            ...post,
            content: getContent(post, true),
            readingTime: readingTime(JSON.stringify(post?.content)),
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

  /** gated and login */
  return (
    <div className="">
      <PostDetail
        post={{
          ...post,
          content: hasMembership ? getContent(post) : getContent(post, true),
          readingTime: readingTime(JSON.stringify(post?.content)),
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
