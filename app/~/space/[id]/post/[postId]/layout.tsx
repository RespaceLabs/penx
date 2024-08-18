'use client'

import { ReactNode } from 'react'
import { PostList } from '@/components/DashboardLayout/Sidebar/PostList'
import { NavbarWrapper } from '@/components/Navbar/NavbarWrapper'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen overflow-auto relative">
      <NavbarWrapper></NavbarWrapper>
      <div className="flex relative">
        <PostList />
        <div className="flex flex-col gap-6 w-[860px] mx-auto rounded-2xl mt-4">
          {children}
        </div>
      </div>
    </div>
  )
}
