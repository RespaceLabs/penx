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
          className="flex gap-8"
          href={`/@${space.subdomain}/${post.slug}`}
        >
          {/* <div className="font-light text-neutral-600">
            {new Date(post.createdAt).toLocaleDateString()}
          </div> */}
          <div className="text-black font-medium hover:underline hover:text-neutral-950 transition-all">
            {post.title}
          </div>
        </Link>
      ))}
    </div>
  )
}
