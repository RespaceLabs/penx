'use client'

import { ReactNode } from 'react'
import { PostHeader } from '@/components/Post/PostHeader'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <PostHeader />
      <div className="pt-20">{children}</div>
    </div>
  )
}
