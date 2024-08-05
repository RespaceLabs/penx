import BlogCard from '@/components/blog-card'
import { Space } from '@prisma/client'

interface Props {
  space: Space
  posts: any[]
}

export function SpaceMain({ space, posts }: Props) {
  return (
    <div className="flex-1 min-h-[100vh] mt-10 pr-8 pb-40">
      <div className="text-4xl font-semibold mb-14">{space.name}</div>

      <div className="grid w-full grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 xl:grid-cols-2">
        {posts.slice(1).map((metadata: any, index: number) => (
          <BlogCard key={index} data={metadata} />
        ))}
      </div>
    </div>
  )
}
