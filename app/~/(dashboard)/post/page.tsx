import { Suspense } from 'react'
import { PostContent } from './PostContent'
import { PostProvider } from './PostProvider'

export default function PostPage() {
  return (
    <Suspense>
      <PostProvider>
        <PostContent />
      </PostProvider>
    </Suspense>
  )
}
