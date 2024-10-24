import { SiteProvider } from '@/components/SiteContext'
import { getSite } from '@/lib/fetchers'

export const dynamic = 'force-static'

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const site = await getSite()
  return <SiteProvider site={site}>{children}</SiteProvider>
}
