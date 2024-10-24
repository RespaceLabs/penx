import { ReactNode } from 'react'
import { DashboardLayout } from './DashboardLayout'

export const dynamic = 'force-static'

export default async function Layout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
