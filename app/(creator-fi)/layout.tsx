'use client'

import { Toaster } from 'sonner'
import { CreatorFiLayout } from './CreatorFiLayout'
import { StoreProvider } from '@/store'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <StoreProvider>
        <Toaster className="dark:hidden" />
        <Toaster theme="dark" className="hidden dark:block" />
        <CreatorFiLayout>{children}</CreatorFiLayout>
      </StoreProvider>
    </div>
  )
}
