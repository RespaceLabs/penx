import { ReactNode } from 'react'
import { CreatePostButton } from './CreatePostButton'
import { PostsNav } from './PostsNav'


// export const dynamic = 'force-static'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-8 p-3 md:p-0">
      <div className="flex items-center justify-between">
        <div className="text-3xl font-bold">My posts</div>
        <CreatePostButton />
      </div>

      <PostsNav />
      {children}
    </div>
  )
}
