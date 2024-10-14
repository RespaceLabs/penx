import { Profile } from '@/components/Profile/Profile'
import { WalletConnectButton } from '@/components/WalletConnectButton'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { SiteLayout } = await import(process.env.NEXT_PUBLIC_THEME!)

  return (
    <SiteLayout
      siteMetadata={null}
      Logo={null}
      ThemeSwitch={null}
      MobileNav={null}
      ConnectButton={Profile}
    >
      {children}
    </SiteLayout>
  )
}
