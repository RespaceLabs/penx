import { getPosts } from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'

const POSTS_PER_PAGE = Number(process.env.NEXT_PUBLIC_POSTS_PER_PAGE || 10)

export default async function Page() {
  const posts = await getPosts()

  const pageNumber = 1
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber,
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  const { BlogPage } = await loadTheme()

  if (!BlogPage) {
    return <div>Theme not found</div>
  }

  return (
    <BlogPage
      posts={posts}
      authors={[]}
      siteMetadata={{}}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
    />
  )
}
