import { Suspense } from 'react'
import { SpaceProvider } from '../../components/SpaceContext'
import { Providers } from '../providers'
import { CreatorFiLayout } from './CreatorFiLayout'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<div></div>}>
      <div className="min-h-screen bg-foreground/5">
        <Providers>
          <SpaceProvider>
            <CreatorFiLayout>{children}</CreatorFiLayout>
          </SpaceProvider>
        </Providers>
      </div>
    </Suspense>
  )
}
