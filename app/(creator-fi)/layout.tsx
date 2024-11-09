'use client'

import { StoreProvider } from '@/store'
import { Toaster } from 'sonner'
import { CreatorFiLayout } from './CreatorFiLayout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-foreground/5">
      <StoreProvider>
        <Toaster className="dark:hidden" />
        <Toaster theme="dark" className="hidden dark:block" />
        <CreatorFiLayout>{children}</CreatorFiLayout>
      </StoreProvider>
    </div>
  )
}
