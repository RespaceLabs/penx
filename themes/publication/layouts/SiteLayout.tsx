import { ReactNode } from 'react'
import { Footer } from '@/components/theme-ui/Footer'
import { Header } from '../components/Header'
import SectionContainer from '../components/SectionContainer'

interface Props {
  site: any
  children: ReactNode
}

export function SiteLayout({ children, site }: Props) {
  return (
    <SectionContainer>
      <Header site={site} />
      <main className="mb-auto mx-auto px-4 md:px-6 w-full lg:max-w-6xl xl:px-0 flex flex-col">
        {children}
      </main>
      <Footer site={site} />
    </SectionContainer>
  )
}
