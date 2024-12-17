'use client'

import { PropsWithChildren } from 'react'
import { SiteProvider } from '@/components/SiteContext'
import { trpc } from '@/lib/trpc'
import { Providers } from './providers'

export function DashboardProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <WithSite>{children}</WithSite>
    </Providers>
  )
}

function WithSite({ children }: PropsWithChildren) {
  const { data } = trpc.site.getSite.useQuery()
  if (!data) return null
  return <SiteProvider site={data}>{children}</SiteProvider>
}
