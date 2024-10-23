import { SiteProvider } from '@/components/SiteContext'
import { getSite } from '@/lib/fetchers'
import { getSession } from '@/lib/getSession'
import { redirect } from 'next/navigation'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  console.log('>>>>xx=======session:', session)

  if (!session) {
    redirect('/')
  }

  const site = await getSite()
  return <SiteProvider site={site}>{children}</SiteProvider>
}
