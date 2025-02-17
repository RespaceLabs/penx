import { ContentRender } from '@/components/theme-ui/ContentRender'
import { POSTS_PER_PAGE } from '@/lib/constants'
import { Post, Site } from '@/lib/theme.types'
import Image from '../components/Image'
import Link from '../components/Link'
import { PostItem } from '../components/PostItem'

interface Props {
  site: Site
  posts: Post[]
}

export function HomePage({ posts = [], site }: Props) {
  return (
    <div className="mt-12">
      <div className="max-w-none mb-10 hover:text-foreground text-foreground/80">
        <div className="flex flex-col items-center flex-shrink-0">
          {site.logo && (
            <Image
              src={site.logo}
              alt="avatar"
              width={192}
              height={192}
              className="h-48 w-48 rounded-full"
            />
          )}
          <h3 className="pb-2 pt-4 text-2xl font-bold leading-8 tracking-tight">
            {site.name}
          </h3>
          <div className="text-foreground/60">{site.description}</div>
        </div>
        <div className="prose max-w-none pb-8 pt-8 dark:prose-invert xl:col-span-2">
          <ContentRender content={site.about} />
        </div>
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

        <div className="grid grid-cols-3 gap-x-6 gap-y-10">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, POSTS_PER_PAGE).map((post) => {
            return <PostItem key={post.slug} post={post} />
          })}
        </div>
      </div>
    </div>
  )
}
