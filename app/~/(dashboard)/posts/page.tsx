'use client'

import { PostStatus } from '@/lib/constants'
import { useSession } from 'next-auth/react'
import { PostList } from '../../PostList'

export const dynamic = 'force-static'

export default function Page() {
  const { data } = useSession()
  console.log('use session============:', data)

  return <PostList status={PostStatus.PUBLISHED} />
}
