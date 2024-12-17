import { getSite, getTags } from '@/lib/fetchers'
import { loadTheme } from '@/themes/theme-loader'
import { Metadata } from 'next'

export const runtime = 'edge'
// export const dynamic = 'force-static'
// export const revalidate = 3600 * 24

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite()
  return {
    title: `Tags | ${site.name}`,
    description: site.description,
  }
}

export default async function Page() {
  const [tags, site] = await Promise.all([getTags(), getSite()])
  const { TagListPage } = loadTheme(site.themeName)

  if (!TagListPage) {
    return <div>Theme not found</div>
  }

  return <TagListPage tags={tags} />
}
