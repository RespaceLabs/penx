import { getPostsForSpace, getSpaceData } from '@/lib/fetchers'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import BlogCard from './SpaceHome/BlogCard'

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

  const [data, posts] = await Promise.all([
    getSpaceData(domain),
    getPostsForSpace(domain),
  ])

  if (!data) {
    notFound()
  }

  return (
    <div className="grid w-full grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 xl:grid-cols-2">
      {!posts.length && <div className="text-neutral-500">No posts yet!</div>}

      {posts.map((metadata, index: number) => (
        <BlogCard key={index} data={metadata} domain={data.subdomain!} />
      ))}
    </div>
  )
}
