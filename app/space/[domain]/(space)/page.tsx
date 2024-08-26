import { getPostsForSpace, getSpaceData } from '@/lib/fetchers'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { getTheme } from '../getTheme'

// export const dynamic = 'force-static'
export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const allSpaces = await prisma.space.findMany({
    select: {
      subdomain: true,
      customDomain: true,
    },
    // feel free to remove this filter if you want to generate paths for all spaces
    where: {
      subdomain: 'demo',
    },
  })

  const allPaths = allSpaces
    .flatMap(({ subdomain, customDomain }) => [
      subdomain && {
        domain: `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
      },
      customDomain && {
        domain: customDomain,
      },
    ])
    .filter(Boolean)

  return allPaths
}

export default async function SpaceHomePage({
  params,
}: {
  params: { domain: string }
}) {
  const domain = decodeURIComponent(params.domain).replace(/^@/, '')

  const [space, posts] = await Promise.all([
    getSpaceData(domain),
    getPostsForSpace(domain),
  ])

  if (!space) {
    notFound()
  }

  const { Home } = getTheme(space.themeName)
  if (!Home) return null
  return <Home space={space} posts={posts as any[]}></Home>
}
