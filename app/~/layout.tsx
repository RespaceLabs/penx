'use client'

import { ReactNode } from 'react'
import { AppProvider } from '@/components/DashboardLayout/AppProvider'
import { DashboardLayout } from '@/components/DashboardLayout/DashboardLayout'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </AppProvider>
  )
}
