'use client'

import { ReactNode } from 'react'
import { AppProvider } from '@/components/DashboardLayout/AppProvider'
import { DashboardLayout } from '@/components/DashboardLayout/DashboardLayout'
import NextNProgress from 'nextjs-progressbar'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <NextNProgress />
      <AppProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </AppProvider>
    </>
  )
}
