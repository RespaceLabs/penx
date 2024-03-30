import React, { lazy, Suspense, useEffect } from 'react'
import { Box } from '@fower/react'
import { set } from 'idb-keyval'
import { useSession } from 'next-auth/react'
import EditorApp from '@penx/app'
import { PENX_SESSION_USER_ID } from '@penx/constants'
import { SessionProvider } from '@penx/session'
import { StoreProvider } from '@penx/store'
import { EarlyAccessCodeProvider } from '~/components/EarlyAccessCode/EarlyAccessCodeProvider'
import { MnemonicGenerator } from '~/components/MnemonicGenerator/MnemonicGenerator'
import { RecoveryPhraseLoginProvider } from '~/components/RecoveryPhraseLogin/RecoveryPhraseLoginProvider'
import { CommonLayout } from '~/layouts/CommonLayout'

const PageEditor = () => {
  const session = useSession()

  useEffect(() => {
    if (session?.data?.userId) {
      set(PENX_SESSION_USER_ID, session?.data?.userId)
    }
  }, [session])

  if (session?.status === 'loading') return null

  // console.log('=========session:', session)

  return (
    <StoreProvider>
      <SessionProvider
        value={{
          data: session.data as any,
          // loading: session.status === 'loading',
          loading: false,
        }}
      >
        <EarlyAccessCodeProvider>
          <MnemonicGenerator>
            <RecoveryPhraseLoginProvider>
              <Suspense
                fallback={
                  <Box h-100vh toCenterY black bgWhite>
                    Loading...
                  </Box>
                }
              >
                <EditorApp />
              </Suspense>
            </RecoveryPhraseLoginProvider>
          </MnemonicGenerator>
        </EarlyAccessCodeProvider>
      </SessionProvider>
    </StoreProvider>
  )
}

export default PageEditor

PageEditor.Layout = CommonLayout
