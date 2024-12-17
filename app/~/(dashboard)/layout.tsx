import { ReactNode, Suspense } from 'react'
import { DashboardProviders } from '@/app/DashboardProviders'
import { DashboardLayout } from './DashboardLayout'

// export const runtime = 'edge'
// export const dynamic = 'force-static'
// export const revalidate = 3600 * 24

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div></div>}>
      <DashboardProviders>
        <DashboardLayout>{children}</DashboardLayout>
      </DashboardProviders>
    </Suspense>
  )
}
