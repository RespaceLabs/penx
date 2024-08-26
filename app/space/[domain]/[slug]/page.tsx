import { PostWithSpace } from '@/hooks/usePost'
import { getSession } from '@/lib/auth'
import { GateType } from '@/lib/constants'
import { getPostData, getSpaceData } from '@/lib/fetchers'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { getTheme } from '../getTheme'

export const dynamic = 'force-dynamic'
// export const dynamic = 'force-static'

export async function generateMetadata({
  params,
}: {
  params: { domain: string; slug: string }
}) {
  const domain = decodeURIComponent(params.domain).replace(/^@/, '')
  const slug = decodeURIComponent(params.slug)

  const [data, spaceData] = await Promise.all([
    getPostData(domain, slug),
    getSpaceData(domain),
  ])
  if (!data || !spaceData) {
    return null
  }
  const { title, description } = data

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@penx',
    },
    // Optional: Set canonical URL to custom domain if it exists
    // ...(params.domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    //   siteData.customDomain && {
    //     alternates: {
    //       canonical: `https://${siteData.customDomain}/${params.slug}`,
    //     },
    //   }),
  }
}

export async function generateStaticParams() {
  const allPosts = await prisma.post.findMany({
    select: {
      slug: true,
      space: {
        select: {
          subdomain: true,
          customDomain: true,
        },
      },
    },
    // feel free to remove this filter if you want to generate paths for all posts
    where: {
      space: {
        subdomain: 'demo',
      },
    },
  })

  const allPaths = allPosts
    .flatMap(({ space, slug }) => [
      space?.subdomain && {
        domain: `${space.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
        slug,
      },
      space?.customDomain && {
        domain: space.customDomain,
        slug,
      },
    ])
    .filter(Boolean)

  return allPaths
}

async function checkCanRead(post: PostWithSpace) {
  const session = await getSession()

  if (!session) return post.gateType === GateType.FREE

  const userId = (session as any).userId as string
  if (post.space.userId === userId) return true

  const member = await prisma.member.findFirst({
    where: { userId, spaceId: post.spaceId },
    select: { id: true },
  })

  return !!member?.id
}

export default async function SpacePostPage({
  params,
}: {
  params: { domain: string; slug: string }
}) {
  const domain = decodeURIComponent(params.domain).replace(/^@/, '')
  const slug = decodeURIComponent(params.slug)
  const post = await getPostData(domain, slug)

  if (!post) {
    notFound()
  }

  const canRead = await checkCanRead(post)

  const { Post } = getTheme(post.space.themeName)

  if (!Post) return null
  return <Post post={post} isGated={!canRead} />
}
