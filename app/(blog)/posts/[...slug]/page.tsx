import { getPost, getPosts } from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'
import { notFound } from 'next/navigation'
import readingTime from 'reading-time'

export default async function Page({ params }: { params: { slug: string[] } }) {
  const slug = decodeURI(params.slug.join('/'))

  // TODO: improve performance
  const [post, posts] = await Promise.all([getPost(slug), getPosts()])

  const postIndex = posts.findIndex((p) => p.slug === slug)
  if (postIndex === -1) {
    return notFound()
  }

  const prev = posts[postIndex + 1]
  const next = posts[postIndex - 1]

  const { PostDetail } = await loadTheme()
  if (!PostDetail) throw new Error('Missing PostDetail component')

  return (
    <PostDetail
      post={{
        ...post,
        readingTime: readingTime(post?.content || ''),
      }}
      next={next}
      prev={prev}
    />
  )
}
