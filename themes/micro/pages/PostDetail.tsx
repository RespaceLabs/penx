import { ReactNode } from 'react'
import { ContentRender } from '@/components/plate-ui/ContentRender'
import { PageTitle } from '@/components/theme-ui/PageTitle'
import { PostActions } from '@/components/theme-ui/PostActions'
import { cn, formatDate } from '@/lib/utils'
import { Post } from '@penxio/types'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface LayoutProps {
  post: Post
  children: ReactNode
  className?: string
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export function PostDetail({
  post,
  next,
  prev,
  className,
  children,
}: LayoutProps) {
  return (
    <div className={cn(className)}>
      <header className="space-y-4 pb-4">
        <PageTitle className="mb-0">{post.title}</PageTitle>
        <dl className="flex items-center gap-2">
          <dt className="sr-only">Published on</dt>
          <dd className="text-base font-medium leading-6 text-foreground/60">
            <time>{formatDate(post.updatedAt)}</time>
          </dd>
          <dd>·</dd>
          <dd className="text-base font-medium leading-6 text-foreground/60">
            {post.readingTime.text}
          </dd>
        </dl>
        <PostActions post={post} />
      </header>
      <div className="grid-rows-[auto_1fr]">
        <div className="prose max-w-none pb-8 dark:prose-invert">
          <ContentRender content={post.content} />
        </div>

        {post.cid && (
          <div className="text-foreground/60 text-sm rounded-md px-3 py-2 border border-sidebar flex items-center gap-2">
            <span className="text-foreground/80">IPFS CID:</span>
            <span>{post.cid}</span>
            <a
              className="inline-flex"
              href={`https://ipfs-gateway.spaceprotocol.xyz/ipfs/${post.cid}`}
              target="_blank"
            >
              <ExternalLink className="cursor-pointer" size={16} />
            </a>
          </div>
        )}

        <footer>
          <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
            {prev && prev.path && (
              <div className="pt-4 xl:pt-8">
                <Link
                  href={`/${prev.path}`}
                  className="text-brand-500 hover:text-brand-600 dark:hover:text-brand-400"
                  aria-label={`Previous post: ${prev.title}`}
                >
                  &larr; {prev.title}
                </Link>
              </div>
            )}
            {next && next.path && (
              <div className="pt-4 xl:pt-8">
                <Link
                  href={`/${next.path}`}
                  className="text-brand-500 hover:text-brand-600 dark:hover:text-brand-400"
                  aria-label={`Next post: ${next.title}`}
                >
                  {next.title} &rarr;
                </Link>
              </div>
            )}
          </div>
        </footer>
      </div>
    </div>
  )
}
