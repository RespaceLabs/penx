import { getPost, getPosts, getSite } from '@/lib/fetchers'
import { GateType } from '@/lib/types'
import { Post } from '@/server/db/schema'
import { loadTheme } from '@/themes/theme-loader'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
// import { PaidContent } from './PaidContent'

function getContent(post: Post) {
  const content = JSON.parse(post.content || '[]')
  return content
}

export const runtime = 'edge'
// export const dynamic = 'force-static'
// export const revalidate = 3600 * 24

export async function generateMetadata({
  params,
}: {
  params: any
}): Promise<Metadata> {
  const slug = decodeURI((await params).slug.join('/'))
  const post = await getPost(slug)

  return {
    title: post?.title,
    description: post?.description,
  }
}

// export async function generateStaticParams() {
//   const posts = await getPosts()
//   return posts.map((post) => ({ slug: [post.slug] }))
// }

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const slug = decodeURI((await params).slug.join('/'))
  const [post, posts, site] = await Promise.all([
    getPost(slug),
    getPosts(),
    getSite(),
  ])

  const postIndex = posts.findIndex((p) => p.slug === slug)
  if (postIndex === -1 || !post) {
    return notFound()
  }

  const prev = posts[postIndex + 1]
  const next = posts[postIndex - 1]

  const { PostDetail } = loadTheme(site.themeName)
  if (!PostDetail) throw new Error('Missing PostDetail component')

  // console.log('=====post:', post)
  return (
    <PostDetail
      post={{
        ...post,
        content: getContent(post),
        readingTime: '',
      }}
      readable
      next={next}
      prev={prev}
    />
  )

  /** No gated */
  // if (post?.gateType == GateType.FREE) {
  //   return (
  //     <>
  //       <PostDetail
  //         post={{
  //           ...post,
  //           content: getContent(post),
  //           readingTime: '',
  //         }}
  //         readable
  //         next={next}
  //         prev={prev}
  //       />
  //     </>
  //   )
  // }

  // return <PaidContent postId={post.id} post={post} next={next} prev={prev} />
}
