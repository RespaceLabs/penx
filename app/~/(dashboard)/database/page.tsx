import { Suspense } from 'react'
import { FullPageDatabase } from '@/components/database-ui'

export default function PostPage() {
  return (
    <Suspense>
      <FullPageDatabase />
    </Suspense>
  )
}
