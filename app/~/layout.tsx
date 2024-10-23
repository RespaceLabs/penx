import { SiteProvider } from '@/components/SiteContext'
import { getSession } from '@/lib/auth'
import { getSite } from '@/lib/fetchers'
import { redirect } from 'next/navigation'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect('/')
  }
  const site = await getSite()
  return <SiteProvider site={site}>{children}</SiteProvider>
}
