'use client'

import { PostList } from '@/app/~/PostList'
import { PostStatus } from '@/lib/constants'

export default function Page() {
  return <PostList status={PostStatus.DRAFT} />
}
