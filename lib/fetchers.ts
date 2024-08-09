import prisma from '@/lib/prisma'
import { unstable_cache } from 'next/cache'

export async function getSpaceData(domain: string) {
  return await unstable_cache(
    async () => {
      return prisma.space.findUnique({
        where: { subdomain: domain },
        include: { user: true },
      })
    },
    [`${domain}-metadata`],
    {
      revalidate: 900,
      tags: [`${domain}-metadata`],
    },
  )()
}

export async function getPostsForSpace(domain: string) {
  return await unstable_cache(
    async () => {
      return prisma.post.findMany({
        where: {
          space: { subdomain: domain },
          published: true,
        },
        select: {
          title: true,
          description: true,
          slug: true,
          image: true,
          published: true,
          imageBlurhash: true,
          createdAt: true,
        },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
      })
    },
    [`${domain}-posts`],
    {
      revalidate: 900,
      tags: [`${domain}-posts`],
    },
  )()
}

export async function getPostData(domain: string, slug: string) {
  return await unstable_cache(
    async () => {
      const data = await prisma.post.findFirst({
        where: {
          space: {
            subdomain: domain,
          },
          slug,
          published: true,
        },
        include: {
          space: {
            include: {
              user: true,
            },
          },
          // user: {
          //   select: {
          //     name: true,
          //     address: true,
          //   },
          // },
        },
      })

      if (!data) return null

      return { ...data }
    },
    [`${domain}-${slug}`],
    {
      revalidate: 900, // 15 minutes
      tags: [`${domain}-${slug}`],
    },
  )()
}

export async function getSpaceWithMembers(domain: string) {
  return await unstable_cache(
    async () => {
      return prisma.space.findUnique({
        where: { subdomain: domain },
        include: {
          members: {
            include: {
              user: {
                select: {
                  ensName: true,
                  address: true,
                },
              },
            },
          },
        },
      })
    },
    [`${domain}-members-metadata`],
    {
      revalidate: 900,
      tags: [`${domain}-members-metadata`],
    },
  )()
}

export async function getSpaceWithSponsors(domain: string) {
  return await unstable_cache(
    async () => {
      return prisma.space.findUnique({
        where: { subdomain: domain },
        include: {
          sponsors: {
            include: {
              user: {
                select: {
                  ensName: true,
                  address: true,
                },
              },
            },
          },
        },
      })
    },
    [`${domain}-sponsors-metadata`],
    {
      revalidate: 900,
      tags: [`${domain}-sponsors-metadata`],
    },
  )()
}

export async function getHomeSpaces() {
  return await unstable_cache(
    async () => {
      return prisma.space.findMany({
        take: 200,
        include: {
          members: {
            take: 5,
            include: {
              user: {
                select: {
                  ensName: true,
                  address: true,
                },
              },
            },
          },
        },
      })
    },
    ['spaces'],
    {
      revalidate: 10,
      tags: ['spaces'],
    },
  )()
}
