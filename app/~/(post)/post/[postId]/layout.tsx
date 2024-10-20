'use client'

import { ReactNode } from 'react'
import { PostHeader } from '@/components/Post/PostHeader'
import { AppProvider } from '../../../AppProvider'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <div className="h-screen overflow-auto relative">
        <div className="flex relative">
          <div className="flex flex-col gap-6 w-[860px] mx-auto rounded-2xl mt-4">
            {children}
          </div>
        </div>
      </div>
    </AppProvider>
  )
}
