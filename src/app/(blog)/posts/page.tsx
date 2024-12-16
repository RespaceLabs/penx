import { getPosts, getSite } from '@/lib/fetchers'
import { loadTheme } from '@/themes/theme-loader'
import { Metadata } from 'next'

const POSTS_PER_PAGE = Number(process.env.NEXT_PUBLIC_POSTS_PAGE_SIZE || 20)

export const runtime = 'edge'
// export const dynamic = 'force-static'
// export const revalidate = 3600 * 24

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite()
  return {
    title: `Blog | ${site.name}`,
    description: site.description,
  }
}

export default async function Page() {
  const [site, posts] = await Promise.all([getSite(), getPosts()])

  const pageNumber = 1
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber,
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  const { BlogPage } = loadTheme(site.themeName)

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
