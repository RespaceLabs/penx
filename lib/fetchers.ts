import prisma from '@/lib/prisma'
import { getSite as getSiteInfo } from '@/server/lib/getSite'
import { unstable_cache } from 'next/cache'
import { PostStatus } from './constants'

export async function getSite() {
  return await unstable_cache(
    async () => {
      return getSiteInfo()
    },
    [`site`],
    {
      revalidate: 3600,
      tags: [`site`],
    },
  )()
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
      revalidate: 3600,
      tags: [`posts`],
    },
  )()
}

export async function getPost(slug: string) {
  return await unstable_cache(
    async () => {
      const data = await prisma.post.findFirst({
        where: { slug },
      })

      if (!data) return null

      return data
    },
    [`post-${slug}`],
    {
      revalidate: 3600, // 15 minutes
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
      revalidate: 3600,
      tags: [`tags`],
    },
  )()
}

export async function getTagWithPost(name: string) {
  return await unstable_cache(
    async () => {
      return prisma.tag.findFirst({
        include: { postTags: { include: { post: true } } },
        where: { name },
      })
    },
    [`tags-${name}`],
    {
      revalidate: 3600,
      tags: [`tags-${name}`],
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
//       revalidate: 3600,
//       tags: [`tags-post`],
//     },
//   )()
// }
