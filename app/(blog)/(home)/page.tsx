import { getPosts, getSite } from '@/lib/fetchers'
import { loadTheme } from '@/themes/theme-loader'
import { Metadata, ResolvingMetadata } from 'next'

export const runtime = 'edge'
// export const dynamic = 'force-static'
// export const revalidate = 3600 * 24

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite()

  return {
    title: site.name,
    description: site.description,
  }
}

export default async function HomePage() {
  const [posts, site] = await Promise.all([getPosts(), getSite()])

  const { HomePage } = loadTheme(site.themeName)

  if (!HomePage) {
    return <div>Theme not found</div>
  }

  return <HomePage posts={posts} authors={[]} site={site} />
}
