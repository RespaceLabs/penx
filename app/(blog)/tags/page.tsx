import { getTags } from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'

export const dynamic = 'force-static'
export const revalidate = 3600 * 24

export default async function Page() {
  const tags = await getTags()
  const { TagListPage } = await loadTheme()

  if (!TagListPage) {
    return <div>Theme not found</div>
  }

  return <TagListPage tags={tags} />
}
