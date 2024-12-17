import { formatDate } from '@/lib/utils'
import { Post } from '@penxio/types'
import Link from 'next/link'
import Tag from './Tag'

interface PostItemProps {
  post: Post
}

export function PostItem({ post }: PostItemProps) {
  const { slug, title } = post

  return (
    <article key={slug} className="flex flex-col space-y-5">
      <Link
        href={`/posts/${slug}`}
        className="object-cover w-full h-52 bg-foreground/10 rounded-lg overflow-hidden hover:scale-105 transition-all"
      >
        {!!post?.image && (
          <img
            src={post.image || ''}
            alt=""
            className="object-cover w-full h-52"
          />
        )}
      </Link>
      <div className="space-y-3">
        <div>
          <div className="flex items-center text-sm gap-3">
            <div className="text-foreground/50">
              {formatDate(post.updatedAt)}
            </div>
            <div className="flex flex-wrap">
              {post.postTags
                // ?.slice(0, 3)
                ?.map((item) => (
                  <Tag key={item.id} postTag={item} className="text-sm" />
                ))}
            </div>
          </div>
          <h2 className="text-2xl font-bold leading-8 tracking-tight">
            <Link
              href={`/posts/${slug}`}
              className="hover:text-foreground transition-colors text-foreground/80"
            >
              {title}
            </Link>
          </h2>
        </div>
        {/* <div className="prose max-w-none text-foreground/70">{summary}</div> */}
      </div>
    </article>
  )
}
