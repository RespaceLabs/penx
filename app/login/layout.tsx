import { PropsWithChildren, useEffect } from 'react'
import { SiteProvider } from '@/components/SiteContext'
import { getSite } from '@/lib/fetchers'
import useSession from '@/lib/useSession'
import { Metadata } from 'next'
import { headers } from 'next/headers'
import { useRouter } from 'next/navigation'
import { Providers } from '../providers'

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite()

  return {
    title: site.name,
    description: site.description,
    // icons: ['https://penx.io/favicon.ico'],
    openGraph: {
      title: site.name,
      description: site.description,
      images: site.image ? [site.image] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: site.name,
      description: site.description,
      images: site.image ? [site.image] : undefined,
      creator: site.name,
    },
    metadataBase: new URL('https://penx.io'),
  }
}

export default async function Layout({ children }: PropsWithChildren) {
  const headerList = await headers()
  const cookies = headerList.get('cookie')
  const url = headerList.get('x-current-path') || ''
  const site = await getSite()
  // const { data, status } = useSession()
  // const { push } = useRouter()

  // useEffect(() => {
  //   if (data) {
  //     push('/')
  //   }
  // }, [data, push])
  // if (status === 'loading') return null
  return (
    <SiteProvider site={site}>
      <Providers cookies={cookies}>{children}</Providers>
    </SiteProvider>
  )
}
