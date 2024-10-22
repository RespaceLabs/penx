import { getPosts, getSite } from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'

export const dynamic = 'force-static'
export const revalidate = 3600 * 24

export default async function HomePage() {
  const [posts, site] = await Promise.all([getPosts(), getSite()])

  const { HomePage } = await loadTheme()

  if (!HomePage) {
    return <div>Theme not found</div>
  }

  return <HomePage posts={posts} authors={[]} site={site} />
}
