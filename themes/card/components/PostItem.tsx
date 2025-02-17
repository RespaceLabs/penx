import { Node } from 'slate'
import { Post, PostType } from '@/lib/theme.types'
import { cn, formatDate } from '@/lib/utils'
import Image from './Image'
import Link from './Link'
import Tag from './Tag'

interface PostItemProps {
  post: Post
}

export function PostItem({ post }: PostItemProps) {
  const { slug, title } = post

  function getCardContent() {
    if (post.type === PostType.IMAGE) {
      return (
        <Image
          src={post.content}
          alt=""
          width={400}
          height={400}
          className="object-cover w-full h-52"
        />
      )
    }

    const getTextFromChildren = (children: any[]) => {
      return children.reduce((acc: string, child: any) => {
        return acc + Node.string(child)
      }, '')
    }

    const text = JSON.parse(post.content)
      .map((element: any) => {
        if (Array.isArray(element.children)) {
          return getTextFromChildren(element.children)
        } else {
          return Node.string(element)
        }
      })
      .join('')

    if (post.type === PostType.NOTE) {
      return (
        <span className="text-foreground/80 p-4 border border-foreground/5 h-full block">
          {text}
        </span>
      )
    }

    if (post?.image) {
      return (
        <Image
          src={post.image || ''}
          alt=""
          width={400}
          height={400}
          className="object-cover w-full h-52"
        />
      )
    }

    return (
      <span className="text-foreground/80 p-4 border border-foreground/5 h-full block">
        {text}
      </span>
    )
  }

  return (
    <article key={slug} className="flex flex-col space-y-5">
      <Link
        href={`/posts/${slug}`}
        className={cn(
          'object-cover w-full h-52 overflow-hidden hover:scale-105 transition-all',
        )}
      >
        {getCardContent()}
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
