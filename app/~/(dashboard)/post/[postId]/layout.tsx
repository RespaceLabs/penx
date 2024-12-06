'use client'

import { ReactNode } from 'react'
import { PostHeader } from '@/components/Post/PostHeader'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-12">
      <PostHeader />
      <div className="mx-auto md:max-w-[750px] w-full">{children}</div>
    </div>
  )
}
