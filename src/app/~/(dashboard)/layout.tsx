import { ReactNode } from 'react'
import { SiteProvider } from '@/components/SiteContext'
import { getSite } from '@/lib/fetchers'
import { DashboardLayout } from './DashboardLayout'

export const dynamic = 'force-static'

export default async function Layout({ children }: { children: ReactNode }) {
  const site = await getSite()
  return (
    <SiteProvider site={site}>
      <DashboardLayout>{children}</DashboardLayout>
    </SiteProvider>
  )
}
