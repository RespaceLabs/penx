import { Post, Space } from '@/theme-helper/types'
import BlogCard from './components/BlogCard'

interface HomeProps {
  posts: Post[]
  space: Space
}
export function Home({ space: space, posts }: HomeProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 xl:grid-cols-2">
      {!posts.length && <div className="text-neutral-500">No posts yet!</div>}

      {posts.map((post, index: number) => (
        <BlogCard key={index} data={post} domain={space.subdomain!} />
      ))}
    </div>
  )
}
