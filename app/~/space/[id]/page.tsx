'use client'

import { useSpace } from './hooks/useSpace'
import { PostList } from './Space/PostList'

export default function Page() {
  const { space } = useSpace()
  return <PostList space={space}></PostList>
}
