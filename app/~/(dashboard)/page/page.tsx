import { Suspense } from 'react'
import { Post } from '@/components/Post/Post'
import { PostProvider } from '@/components/Post/PostProvider'

export default function PageApp() {
  return (
    <Suspense>
      <PostProvider>
        <Post />
      </PostProvider>
    </Suspense>
  )
}
