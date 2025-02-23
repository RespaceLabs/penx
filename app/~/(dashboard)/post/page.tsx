import { Suspense } from 'react'
import { PostProvider } from '@/components/Post/PostProvider'
import { PostContent } from './PostContent'

export default function PostPage() {
  return (
    <Suspense>
      <PostProvider>
        <PostContent />
      </PostProvider>
    </Suspense>
  )
}
