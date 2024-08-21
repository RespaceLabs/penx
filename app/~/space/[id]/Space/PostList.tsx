'use client'

import BlogCard from '@/components/blog-card'
import { Skeleton } from '@/components/ui/skeleton'
import { trpc } from '@/lib/trpc'
import { Space } from '@prisma/client'
import { useParams } from 'next/navigation'

interface Props {
  space: Space
}

export function PostList({ space }: Props) {
  const params = useParams() as Record<string, string>
  const { data: posts = [], isLoading } = trpc.post.listBySpaceId.useQuery(
    params.id,
  )

  if (isLoading) {
    return (
      <div className="grid w-full grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 xl:grid-cols-2">
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <Skeleton key={index} className="h-[340px]" />
          ))}
      </div>
    )
  }

  if (!posts?.length) {
    return <div className="text-neutral-500">No posts yet!</div>
  }

  return (
    <div className="grid w-full grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 xl:grid-cols-2">
      {posts.map((metadata: any, index: number) => (
        <BlogCard
          key={index}
          data={metadata}
          onClick={(post) => {
            const url = process.env.NEXT_PUBLIC_VERCEL_ENV
              ? `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/@${space?.subdomain}/${post.slug}`
              : `http://localhost:3000/@${space?.subdomain}/${post.slug}`
            window.open(url)
          }}
        />
      ))}
    </div>
  )
}
