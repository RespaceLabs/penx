import { ReactNode } from 'react'
import { Site } from '@penxio/types'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import SectionContainer from '../components/SectionContainer'

interface Props {
  site: Site
  Logo: () => ReactNode
  ModeToggle: () => ReactNode
  MobileNav: () => ReactNode
  ConnectButton: () => ReactNode
  Airdrop: () => ReactNode
  children: ReactNode
}

export function SiteLayout({
  children,
  site,
  Logo,
  ModeToggle,
  MobileNav,
  ConnectButton,
  Airdrop,
}: Props) {
  return (
    <SectionContainer>
      {ModeToggle && (
        <div className="absolute top-3 right-3 hidden xs:block">
          <ModeToggle />
        </div>
      )}

      <Header
        site={site}
        Logo={Logo}
        ModeToggle={ModeToggle}
        MobileNav={MobileNav}
        ConnectButton={ConnectButton}
        Airdrop={Airdrop}
      />
      <main className="mb-auto">{children}</main>
      <Footer site={site} ModeToggle={ModeToggle} />
    </SectionContainer>
  )
}
