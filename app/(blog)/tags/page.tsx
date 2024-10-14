import { getTags } from '@/lib/fetchers'

export default async function Page() {
  const tags = await getTags()

  if (!process.env.NEXT_PUBLIC_THEME) {
    return <div>Theme not found</div>
  }

  const { TagListPage } = await import(process.env.NEXT_PUBLIC_THEME!)

  if (!TagListPage) {
    return <div>Theme not found</div>
  }

  return <TagListPage tags={tags} />
}
