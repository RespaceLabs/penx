'use client'

import { ReactNode } from 'react'
import { PostNav } from '@/components/Post/PostNav'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-12">
      <PostNav />
      <div className="mx-auto md:max-w-[750px] w-full">{children}</div>
    </div>
  )
}
