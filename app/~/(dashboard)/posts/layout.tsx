import { ReactNode } from 'react'
import { PostsNav } from './PostsNav'

export const dynamic = 'force-static'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="text-3xl font-bold">Your Post</div>
      </div>
      <PostsNav />
      {children}
    </div>
  )
}
