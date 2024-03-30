import React, { PropsWithChildren, Suspense } from 'react'
import { Box } from '@fower/react'
import EditorApp from '@penx/app'
import { StoreProvider } from '@penx/store'
import { EarlyAccessCodeProvider } from '~/components/EarlyAccessCode/EarlyAccessCodeProvider'
import { MnemonicGenerator } from '~/components/MnemonicGenerator/MnemonicGenerator'
import { RecoveryPhraseLoginProvider } from '~/components/RecoveryPhraseLogin/RecoveryPhraseLoginProvider'
import { CommonLayout } from '~/layouts/CommonLayout'

const OnlineProvider = ({ children }: PropsWithChildren) => {
  if (!navigator.onLine) return <>{children}</>
  return (
    <EarlyAccessCodeProvider>
      <MnemonicGenerator>
        <RecoveryPhraseLoginProvider>{children}</RecoveryPhraseLoginProvider>
      </MnemonicGenerator>
    </EarlyAccessCodeProvider>
  )
}

const PageEditor = () => {
  return (
    <StoreProvider>
      <OnlineProvider>
        <Suspense
          fallback={
            <Box h-100vh toCenterY black bgWhite>
              Loading...
            </Box>
          }
        >
          <EditorApp />
        </Suspense>
      </OnlineProvider>
    </StoreProvider>
  )
}

export default PageEditor

PageEditor.Layout = CommonLayout
