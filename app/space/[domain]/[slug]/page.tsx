import BlurImage from '@/components/blur-image'
import { Badge } from '@/components/ui/badge'
import { PostWithSpace } from '@/hooks/usePost'
import { getSession } from '@/lib/auth'
import { GateType, PostType } from '@/lib/constants'
import { getPostData, getSpaceData } from '@/lib/fetchers'
import prisma from '@/lib/prisma'
import { toDateString } from '@/lib/utils'
import { TipTapNode, TipTapRender } from '@troop.com/tiptap-react-render'
import { notFound } from 'next/navigation'
import { GateCover } from './GateCover'
import { handlers } from './handlers'
import { ImageCreation } from './ImageCreation'
import { PostActionBar } from './PostActionBar'
import { PostCreation } from './PostCreation'
import { PromotionCard } from './PromotionCard'

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

  return (
    <div className="pb-20 min-h-[72vh]">
      <div className="flex flex-col mx-auto w-[720px]">
        <div>
          <h1 className="mb-10 font-title text-3xl font-bold text-stone-800 dark:text-white md:text-6xl">
            {post.title}
          </h1>
          {post.description && (
            <p className="text-md m-auto w-10/12 text-stone-600 dark:text-stone-400 md:text-lg">
              {post.description}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center font-semibold">
            <div className="h-10 w-10 rounded-full inline-flex">
              <BlurImage
                alt={post.space!.name ?? 'User Avatar'}
                src={
                  post.space!.logo ||
                  'https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/JRajRyC-PhBHEinQkupt02jqfKacBVHLWJq7Iy.png'
                }
                layout="responsive"
                height={40}
                width={40}
              />
            </div>

            <div>{post.space?.name}</div>

            <div>
              <Badge variant="secondary" className="inline-flex py-1">
                {toDateString(post.createdAt)}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* <PostTradeModal space={post.space} post={post} /> */}
          </div>
        </div>

        {post.type === PostType.ARTICLE && (
          <PostCreation canRead={canRead} post={post} />
        )}

        {post.type === PostType.IMAGE && (
          <ImageCreation canRead={canRead} post={post} />
        )}
      </div>
    </div>
  )
}
