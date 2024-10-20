import { PostStatus } from '@/lib/constants'
import { PostList } from '../../PostList'

export default async function Page() {
  return <PostList status={PostStatus.PUBLISHED} />
}
