import { PostList } from '@/components/PostList'
import { PostStatus } from '@/lib/constants'

// export const runtime = 'edge'
// export const dynamic = 'force-static'

export default function Page() {
  return <PostList status={PostStatus.PUBLISHED} />
}
