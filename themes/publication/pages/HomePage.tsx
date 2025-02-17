import { Button } from '@/components/ui/button'
import { Post, Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import FeaturedPost from '../components/FeaturedPost'
import Link from '../components/Link'
import { PostItem } from '../components/PostItem'
import { Sidebar } from '../components/Sidebar'

interface Props {
  site: Site
  posts: Post[]
}

export function HomePage({ posts = [], site }: Props) {
  const { popularPosts, featuredPost, commonPosts } = extractPosts(posts)

  const displayedPosts = commonPosts.slice(0, 100)
  return (
    <div className="mt-12 flex flex-col gap-20 md:flex-row">
      <div className="flex-1">
        {featuredPost && <FeaturedPost post={featuredPost} />}

        <div className="grid gap-2">
          {displayedPosts.map((post, index) => {
            return (
              <PostItem
                key={post.slug}
                post={post}
                className={cn(
                  displayedPosts.length - 1 !== index &&
                    'border-b border-foreground/10',
                )}
              />
            )
          })}
        </div>
        <div className="flex justify-center">
          <Link
            href="/posts"
            className="text-brand-500 hover:text-brand-600 dark:hover:text-brand-400"
          >
            <Button variant="secondary">All posts &rarr;</Button>
          </Link>
        </div>
      </div>

      <Sidebar site={site} posts={popularPosts}></Sidebar>
    </div>
  )
}

function extractPosts(posts: Post[]) {
  const popularPosts = posts.filter((post) => post.isPopular)
  const featuredPost = posts.find((post) => post.featured) || posts[0]
  const ids = popularPosts.map((post) => post.id)
  if (featuredPost) ids.push(featuredPost.id)
  const commonPosts = posts.filter((post) => !ids.includes(post.id))
  return {
    popularPosts,
    featuredPost,
    commonPosts,
  }
}
