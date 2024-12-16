import { ReactNode } from 'react'
import { ExternalLink } from 'lucide-react'
import { Post } from '@penxio/types'
import { cn, formatDate } from '@/lib/utils'
import Link from '../components/Link'
import PageTitle from '../components/PageTitle'

interface LayoutProps {
  post: Post
  children: ReactNode
  className?: string
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  PostActions?: (props: { post: Post; className?: string }) => JSX.Element
  ContentRender?: (props: { content: any; className?: string }) => JSX.Element
}

export function PostDetail({
  post,
  next,
  prev,
  className,
  PostActions,
  ContentRender,
}: LayoutProps) {
  return (
    <div className={cn(className)}>
      <header className="space-y-4 pb-4">
        <PageTitle className="mb-0">{post.title}</PageTitle>
        <div className="flex items-center justify-between">
          <dl className="flex items-center gap-2 text-foreground/50">
            <dt className="sr-only">Published on</dt>
            <dd className="text-base font-medium leading-6">
              <time>{formatDate(post.updatedAt)}</time>
            </dd>
            <dd>·</dd>
            <dd className="text-base font-medium leading-6">
              {post.readingTime.text}
            </dd>
          </dl>
        </div>

        {PostActions && <PostActions post={post} />}
      </header>
      <div className="grid-rows-[auto_1fr]">
        <div className="prose max-w-none pb-8 dark:prose-invert">
          {ContentRender && <ContentRender content={post.content} />}
        </div>
        {post.cid && (
          <div className="text-foreground/60 text-xs rounded-md py-2 md:flex items-center gap-2 hidden">
            <span className="text-foreground/80">IPFS CID:</span>
            <span>{post.cid}</span>
            <a
              className="inline-flex"
              href={`https://ipfs-gateway.spaceprotocol.xyz/ipfs/${post.cid}`}
              target="_blank"
            >
              <ExternalLink className="cursor-pointer" size={12} />
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
