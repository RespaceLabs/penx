import { getSite, getSpace } from '@/lib/fetchers'
import { StoreProvider } from '@/store'
import { Toaster } from 'sonner'
import { SpaceProvider } from '../../components/SpaceContext'
import { CreatorFiLayout } from './CreatorFiLayout'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const site = await getSite()
  if (!site?.spaceId) return null
  const space = await getSpace(site.spaceId)

  return (
    <div className="min-h-screen bg-foreground/5">
      <SpaceProvider space={space}>
        <StoreProvider>
          <Toaster className="dark:hidden" />
          <Toaster theme="dark" className="hidden dark:block" />
          <CreatorFiLayout space={space}>{children}</CreatorFiLayout>
        </StoreProvider>
      </SpaceProvider>
    </div>
  )
}
