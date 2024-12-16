import { getSite, getTags } from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'
import { Metadata } from 'next'

export const dynamic = 'force-static'
export const revalidate = 3600 * 24

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite()
  return {
    title: `Tags | ${site.name}`,
    description: site.description,
  }
}

export default async function Page() {
  const tags = await getTags()
  const { TagListPage } = await loadTheme()

  if (!TagListPage) {
    return <div>Theme not found</div>
  }

  return <TagListPage tags={tags} />
}
