import { formatDate } from '@/lib/utils'
import { Post } from '@penxio/types'
import Link from 'next/link'

interface PostItemProps {
  post: Post
}

export function PostItem({ post }: PostItemProps) {
  const { slug, title } = post

  return (
    <Link
      key={slug}
      href={`/posts/${slug}`}
      className="hover:text-foreground flex items-center justify-between gap-6 text-foreground/80"
    >
      <div className="text-lg">{title}</div>
      <time className="text-sm text-foreground/50">
        {formatDate(post.updatedAt)}
      </time>
    </Link>
  )
}
