'use client'

import { useSpace } from '@/hooks/useSpace'
import { PostList } from '../Space/PostList'

export default function Page() {
  const { space, isLoading } = useSpace()
  if (isLoading || !space) return null
  return <PostList space={space}></PostList>
}
