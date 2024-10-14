'use client'

import { PostStatus } from '@/lib/constants'
import { PostList } from '../../PostList'

export default function Page() {
  return <PostList status={PostStatus.PUBLISHED} />
}
