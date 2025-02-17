'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Node } from 'slate'
import { PlateEditor } from '@/components/editor/plate-editor'
import { PostActions } from '@/components/theme-ui/PostActions'
import { Post, PostType, User } from '@/lib/theme.types'
import { cn, formatDate } from '@/lib/utils'
import { getUserName } from '../lib/getUserName'
import { AuthorAvatar } from './AuthorAvatar'

interface PostItemProps {
  post: Post
  receivers?: string[]
  className?: string
  ContentRender?: (props: { content: any[]; className?: string }) => JSX.Element
}

export function PostItem({ post, receivers = [], className }: PostItemProps) {
  const { slug, title } = post
  const name = getUserName(post.user)
  const params = useSearchParams()!
  const type = params.get('type')

  // console.log('========post:', post)

  if (type === 'photos' && post.type !== PostType.IMAGE) return null
  if (type === 'notes' && post.type !== PostType.NOTE) return null
  if (type === 'articles' && post.type !== PostType.ARTICLE) return null

  const getTitle = () => {
    if (post.type === PostType.IMAGE) return <div className="">{title}</div>
    if (post.type === PostType.NOTE) return <div className="">a note</div>
    if (post.type === PostType.ARTICLE) {
      return <div className="">an article</div>
    }
    return <div></div>
  }

  const getContent = () => {
    if (post.type === PostType.IMAGE) {
      return (
        <img src={post.content} alt="" className="w-full h-auto rounded-lg" />
      )
    }

    if (post.type === PostType.NOTE) {
      return (
        <div className="text-foreground/80">
          <PlateEditor
            value={JSON.parse(post.content)}
            readonly
            className="px-0 py-0"
          />
        </div>
      )
    }

    const nodes: any[] =
      typeof post.content === 'string' ? JSON.parse(post.content) : post.content
    const str = nodes.map((node) => Node.string(node)).join('') || ''

    return (
      <Link href={`/posts/${slug}`} className="space-y-2">
        <h2 className="text-2xl font-bold hover:scale-105 transition-all origin-left block">
          {post.title}
        </h2>
        <p className="text-foreground/70 hover:text-foreground transition-all hover:scale-105 line-clamp-2">
          {post.description || str?.slice(0, 200)}
        </p>
      </Link>
    )
  }

  return (
    <div className={cn('flex justify-between items-center gap-10', className)}>
      <div className="flex flex-col gap-3 py-8 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <AuthorAvatar post={post} />
            <div className="font-medium">{name}</div>
            <div className="text-foreground/50 text-sm">posted</div>
            {getTitle()}
          </div>
          <time className="text-xs text-foreground/50">
            {formatDate(post.updatedAt)}
          </time>
        </div>

        {getContent()}
        <PostActions post={post} receivers={receivers} />
      </div>

      {post.image && (
        <div className="max-w-[160px]">
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
  )
}
