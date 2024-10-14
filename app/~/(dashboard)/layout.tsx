'use client'

import { ReactNode } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout/DashboardLayout'
import { NewButton } from '@/components/Navbar/NewButton'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout>
      <div className="mx-auto md:max-w-2xl pt-16 pb-20">{children}</div>
    </DashboardLayout>
  )
}
