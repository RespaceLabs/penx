import { Profile } from '@/components/Profile/Profile'
import { getSite } from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'

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
      ThemeSwitch={null}
      MobileNav={null}
      ConnectButton={Profile}
    >
      {children}
    </SiteLayout>
  )
}
