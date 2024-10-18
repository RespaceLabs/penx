import { getTags } from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'
import prisma from '@/lib/prisma'

export default async function TagPage({ params }: { params: { tag: string } }) {
  const tagName = decodeURI(params.tag)

  const [tag, tags] = await Promise.all([
    prisma.tag.findFirst({
      include: { postTags: { include: { post: true } } },
      where: { name: tagName },
    }),
    getTags(),
  ])

  const posts = tag?.postTags.map((postTag) => postTag.post) || []

  const { TagDetailPage } = await loadTheme()

  return <TagDetailPage posts={posts} tags={tags} />
}
