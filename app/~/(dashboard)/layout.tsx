import { ReactNode } from 'react'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DashboardLayout } from './DashboardLayout'

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await getSession()
  if (!session) {
    redirect('/')
  }
  return <DashboardLayout>{children}</DashboardLayout>
}
