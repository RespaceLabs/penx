import { ContentRender } from '@/components/ContentRender/ContentRender'
import { PostActions } from '@/components/PostActions/PostActions'
import { getPosts, getSite } from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'
import { Metadata, ResolvingMetadata } from 'next'

export const dynamic = 'force-static'
export const revalidate = 3600 * 24

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite()

  return {
    title: site.name,
    description: site.description,
  }
}

export default async function HomePage() {
  const [posts, site] = await Promise.all([getPosts(), getSite()])

  const { HomePage } = await loadTheme()

  if (!HomePage) {
    return <div>Theme not found</div>
  }

  return (
    <HomePage
      posts={posts}
      authors={[]}
      site={site}
      ContentRender={ContentRender}
      PostActions={PostActions}
    />
  )
}
