import { SiteProvider } from '@/components/SiteContext'
import { getSite } from '@/lib/fetchers'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const site = await getSite()
  return <SiteProvider site={site}>{children}</SiteProvider>
}
