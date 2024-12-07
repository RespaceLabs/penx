import prisma from '@/lib/prisma'
import { getSite as getSiteInfo } from '@/server/lib/getSite'
import ky from 'ky'
import { unstable_cache } from 'next/cache'
import { isProd, PostStatus, RESPACE_BASE_URI } from './constants'
import { SpaceType } from './types'
import { getUrl } from './utils'

export async function getSite() {
  return await unstable_cache(
    async () => {
      return getSiteInfo()
    },
    [`site`],
    {
      revalidate: isProd ? 3600 * 24 : 10,
      tags: [`site`],
    },
  )()
}

export async function getPosts() {
  return await unstable_cache(
    async () => {
      const posts = await prisma.post.findMany({
        include: {
          postTags: { include: { tag: true } },
          user: {
            select: {
              email: true,
              name: true,
              image: true,
              accounts: true,
            },
          },
        },
        where: {
          postStatus: PostStatus.PUBLISHED,
        },
        orderBy: [{ createdAt: 'desc' }],
      })
      return posts.map((post) => ({
        ...post,
        image: getUrl(post.image || ''),
      }))
    },
    [`posts`],
    {
      revalidate: isProd ? 3600 * 24 : 10,
      tags: [`posts`],
    },
  )()
}

export async function getPost(slug: string) {
  return await unstable_cache(
    async () => {
      const post = await prisma.post.findFirst({
        where: { slug },
      })

      if (!post) return null

      return {
        ...post,
        image: getUrl(post.image || ''),
      }
    },
    [`post-${slug}`],
    {
      revalidate: 3600 * 24, // 15 minutes
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

export async function getSpace(spaceId: string) {
  return await unstable_cache(
    async () => {
      const response = await ky
        .get(RESPACE_BASE_URI + `/api/get-space?address=${spaceId}`)
        .json<SpaceType>()
      return response
    },
    [`space-${spaceId}`],
    {
      revalidate: isProd ? 3600 : 10,
      tags: [`space-${spaceId}`],
    },
  )()
}
