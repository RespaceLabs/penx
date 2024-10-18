import { getTags } from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'

export default async function Page() {
  const tags = await getTags()
  const { TagListPage } = await loadTheme()

  if (!TagListPage) {
    return <div>Theme not found</div>
  }

  return <TagListPage tags={tags} />
}
