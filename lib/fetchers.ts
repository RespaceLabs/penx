import prisma from '@/lib/prisma'
import { getSite as getSiteInfo } from '@/server/lib/getSite'
import { unstable_cache } from 'next/cache'
import { PostStatus } from './constants'

export async function getSite() {
  return getSiteInfo()
}

export async function getPosts() {
  return await unstable_cache(
    async () => {
      return prisma.post.findMany({
        include: {
          postTags: { include: { tag: true } },
        },
        where: {
          postStatus: PostStatus.PUBLISHED,
        },
        orderBy: [{ createdAt: 'desc' }],
      })
    },
    [`posts`],
    {
      revalidate: 900,
      tags: [`posts`],
    },
  )()
}

export async function getPost(slug: string) {
  return await unstable_cache(
    async () => {
      const data = await prisma.post.findFirst({
        where: {
          slug,
        },
      })

      if (!data) return null

      return { ...data }
    },
    [`post-${slug}`],
    {
      revalidate: 900, // 15 minutes
      tags: [`posts-${slug}`],
    },
  )()
}

export async function getTags() {
  return await unstable_cache(
    async () => {
      return prisma.tag.findMany()
    },
    [`tags`],
    {
      revalidate: 5,
      tags: [`tags`],
    },
  )()
}

// export async function getTagPosts() {
//   return await unstable_cache(
//     async () => {
//       return prisma.tag.findMany()
//     },
//     [`tags-posts`],
//     {
//       revalidate: 900,
//       tags: [`tags-post`],
//     },
//   )()
// }
