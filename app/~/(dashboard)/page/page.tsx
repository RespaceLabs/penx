import { Suspense } from 'react'
import { Page } from '@/components/Page/Page'
import { PageProvider } from './PageProvider'

export default function PageApp() {
  return (
    <Suspense>
      <PageProvider>
        <Page></Page>
      </PageProvider>
    </Suspense>
  )
}
