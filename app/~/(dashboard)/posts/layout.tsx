import { ReactNode } from 'react'
import { NewButton } from '@/components/Navbar/NewButton'
import { PostsNav } from './PostsNav'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="text-3xl font-bold">Your posts</div>
        {/* <NewButton></NewButton> */}
      </div>
      <PostsNav />
      {children}
    </div>
  )
}
