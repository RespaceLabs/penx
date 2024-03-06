import React, { lazy, Suspense } from 'react'
import { Box } from '@fower/react'
import { useSession } from 'next-auth/react'
import { SessionProvider } from '@penx/session'
import { MasterPasswordProvider } from '~/components/MasterPasswordProvider'

const LazyEditorApp = lazy(() => import('@penx/app'))

const PageEditor = () => {
  const session = useSession()

  if (session?.status === 'loading') return null

  // console.log('=========session:', session)

  return (
    <SessionProvider
      value={{
        data: session.data as any,
        // loading: session.status === 'loading',
        loading: false,
      }}
    >
      <MasterPasswordProvider>
        <Suspense
          fallback={
            <Box h-100vh toCenterY black bgWhite>
              Loading...
            </Box>
          }
        >
          <LazyEditorApp></LazyEditorApp>
        </Suspense>
      </MasterPasswordProvider>
    </SessionProvider>
  )
}

export default PageEditor
