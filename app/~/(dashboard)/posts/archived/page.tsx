import { PostList } from '@/app/~/PostList'
import { PostStatus } from '@/lib/constants'

export const dynamic = 'force-static'

export default async function Page() {
  return <PostList status={PostStatus.ARCHIVED} />
}
