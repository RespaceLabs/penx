import { ContentRender } from '@/components/theme-ui/ContentRender'
import { Post, Site } from '@/lib/theme.types'
import { cn, formatDate } from '@/lib/utils'
import { format } from 'date-fns'
import Image from 'next/image'
import { getUserName } from '../lib/getUserName'
import { AuthorAvatar } from './AuthorAvatar'
import Link from './Link'

interface Props {
  posts: Post[]
}

export const MostPopular = ({ posts }: Props) => {
  return (
    <div className="space-y-4">
      <div className="font-medium text-xl">Most Popular</div>
      <div className="grid gap-5">
        {posts.slice(0, 5).map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between gap-2"
          >
            <div className="flex flex-col gap-2">
              <Link
                href={`/posts/${post.slug}`}
                key={post.slug}
                className="text-base leading-tight font-bold text-foreground/80 hover:text-foreground"
              >
                {post.title}
              </Link>
              <div className="flex items-center text-xs gap-2">
                <div className="flex items-center gap-1">
                  <AuthorAvatar post={post} className="h-5 w-5" />
                  <div className="font-medium">{getUserName(post.user)}</div>
                </div>
                <time className="text-xs text-foreground/50">
                  {/* {format(new Date(post.updatedAt), 'MM/dd')} */}
                  {formatDate(post.updatedAt)}
                </time>
              </div>
            </div>

            {post.image && (
              <div className="max-w-[80px] justify-between">
                <Link href={`/posts/${post.slug}`}>
                  <Image
                    src={post.image || ''}
                    className="w-full h-auto rounded"
                    style={{
                      aspectRatio: '1.5/1',
                    }}
                    width={400}
                    height={400}
                    alt=""
                  />
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
