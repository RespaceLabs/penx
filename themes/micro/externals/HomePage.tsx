import { Post, Site } from '@penxio/types'
import Link from '../components/Link'
import PageTitle from '../components/PageTitle'
import { PostItem } from '../components/PostItem'

const POSTS_PER_PAGE = Number(process.env.NEXT_PUBLIC_POSTS_PER_PAGE || 10)

interface Props {
  site: Site
  posts: Post[]
  ContentRender: (props: { content: any[]; className?: string }) => JSX.Element
}

export function HomePage({ posts = [], site, ContentRender }: Props) {
  return (
    <div className="">
      <div className="prose max-w-none mb-10 text-foreground/70">
        <PageTitle>{site.name}</PageTitle>
        <ContentRender content={site.about} />
      </div>

      <div className="">
        <div className="pb-6 pt-6 flex items-center justify-between">
          <h1 className="text-xl font-medium tracking-tight text-foreground sm:text-3xl leading-none">
            Latest
          </h1>

          {posts.length > POSTS_PER_PAGE && (
            <Link
              href="/posts"
              className="text-brand-500 hover:text-brand-600 dark:hover:text-brand-400"
            >
              All posts &rarr;
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 gap-6">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, POSTS_PER_PAGE).map((post) => {
            return <PostItem key={post.slug} post={post} />
          })}
        </div>
      </div>
    </div>
  )
}
