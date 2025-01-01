'use client'

import { PropsWithChildren } from 'react'
import { LoadingDots } from '@/components/icons/loading-dots'
import { SiteProvider } from '@/components/SiteContext'
import { useDatabases } from '@/lib/hooks/useDatabases'
import { trpc } from '@/lib/trpc'
import { Providers } from './providers'

export function DashboardProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <WithDataLoader>{children}</WithDataLoader>
    </Providers>
  )
}

function WithDataLoader({ children }: PropsWithChildren) {
  useDatabases()
  const { data } = trpc.site.getSite.useQuery()
  if (!data)
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingDots className="bg-foreground/60"></LoadingDots>
      </div>
    )
  return <SiteProvider site={data}>{children}</SiteProvider>
}
