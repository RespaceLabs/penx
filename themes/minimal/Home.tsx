import { Post, Space } from '@/theme-helper/types'
import Link from 'next/link'

interface HomeProps {
  posts: Post[]
  space: Space
}
export function Home({ space, posts }: HomeProps) {
  return (
    <div className="grid w-ful gap-4">
      {!posts.length && <div className="text-neutral-500">No posts yet!</div>}

      {posts.map((post) => (
        <Link
          key={post.id}
          className="flex gap-4 items-center"
          href={`/@${space.subdomain}/${post.slug}`}
        >
          <div className="text-black font-medium hover:underline hover:text-neutral-950 transition-all">
            {post.title}
          </div>

          <div className="font-light text-neutral-400 text-sm">
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </Link>
      ))}
    </div>
  )
}
