import { PostActions } from '@/components/theme-ui/PostActions'
import { Post } from '@/lib/theme.types'
import { cn, formatDate } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  post: Post
}

export default function FeaturedPost({ post }: Props) {
  return (
    <div className="flex flex-col gap-y-3 mt-2">
      <Link href={`/posts/${post.slug}`}>
        <Image
          src={post.image || ''}
          className="w-full h-full transition-all hover:scale-105"
          width={1000}
          height={1000}
          alt=""
        />
      </Link>
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-bold text-2xl hover:scale-105 transition-all origin-left">
          <Link href={`/posts/${post.slug}`}>{post.title}</Link>
        </h2>
        <time className="text-sm text-foreground/50">
          {formatDate(post.updatedAt)}
        </time>
      </div>
      <PostActions post={post} />
    </div>
  )
}
