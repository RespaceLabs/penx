import { ModeToggle } from '@/components/ModeToggle'
import { Profile } from '@/components/Profile/Profile'
import { getSite } from '@/lib/fetchers'
import { getSession } from '@/lib/getSession'
import { loadTheme } from '@/lib/loadTheme'

export const dynamic = 'force-static'
export const revalidate = 3600 * 24

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const site = await getSite()
  const { SiteLayout } = await loadTheme()

  return (
    <SiteLayout
      site={site}
      Logo={null}
      ModeToggle={ModeToggle}
      MobileNav={null}
      ConnectButton={Profile}
    >
      {children}
    </SiteLayout>
  )
}
