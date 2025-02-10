import { Tag } from '@/lib/theme.types'
import { PageTitle } from '@/components/theme-ui/PageTitle'
import { TagList } from '../components/TagList'

interface Props {
  tags: Tag[]
}

export function TagListPage({ tags }: Props) {
  return (
    <div className="flex flex-col">
      <PageTitle>Tags</PageTitle>
      <div className="grid gap-y-3">
        {tags.length === 0 && 'No tags found.'}
        {tags.length > 0 && <TagList tags={tags} />}
      </div>
    </div>
  )
}
