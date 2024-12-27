import { ReactNode } from 'react'
import { Footer } from '@/components/theme-ui/Footer'
import { Site } from '@penxio/types'
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

export function SiteLayout({ children, site }: Props) {
  return (
    <SectionContainer>
      <Header site={site} />
      <main className="mb-auto">{children}</main>
      <Footer site={site} />
    </SectionContainer>
  )
}