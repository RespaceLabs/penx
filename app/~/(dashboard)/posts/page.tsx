import { getSession } from '@/lib/auth'
import { PostStatus } from '@/lib/constants'
import { redirect } from 'next/navigation'
import { PostList } from '../../PostList'

export default async function Page() {
  const session = await getSession()
  if (!session) {
    redirect('/')
  }
  return <PostList status={PostStatus.PUBLISHED} />
}
