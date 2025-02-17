import { ContentRender } from '@/components/theme-ui/ContentRender'
import { PageTitle } from '@/components/theme-ui/PageTitle'
import { POSTS_PER_PAGE } from '@/lib/constants'
import { Post, Site } from '@/lib/theme.types'
import Link from '../components/Link'
import { PostItem } from '../components/PostItem'

interface Props {
  site: Site
  posts: Post[]
}

export function HomePage({ posts = [], site }: Props) {
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
