import { PostList } from '@/app/~/PostList'
import { PostStatus } from '@/lib/constants'

export default async function Page() {
  return <PostList status={PostStatus.DRAFT} />
}
