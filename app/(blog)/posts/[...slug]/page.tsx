import { getPost } from '@/lib/fetchers'
import readingTime from 'reading-time'

export default async function Page({ params }: { params: { slug: string[] } }) {
  const slug = decodeURI(params.slug.join('/'))
  const post = await getPost(slug)

  const { PostDetail } = await import(process.env.NEXT_PUBLIC_THEME!)
  if (!PostDetail) throw new Error('Missing PostDetail component')

  return (
    <PostDetail
      post={{
        ...post,
        readingTime: readingTime(post?.content || ''),
      }}
    />
  )
}
