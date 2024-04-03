import React, { PropsWithChildren, Suspense, useEffect, useRef } from 'react'
import { Box } from '@fower/react'
import EditorApp from '@penx/app'
import { appEmitter } from '@penx/event'
import { useSession } from '@penx/session'
import {
  FirstLocalSpaceGenerator,
  RecoveryPhraseLoginProvider,
} from '@penx/widget'
import { EarlyAccessCodeProvider } from '~/components/EarlyAccessCode/EarlyAccessCodeProvider'
import { MnemonicGenerator } from '~/components/MnemonicGenerator/MnemonicGenerator'
import { CommonLayout } from '~/layouts/CommonLayout'

const OnlineProvider = ({ children }: PropsWithChildren) => {
  const { data, loading } = useSession()
  if (loading) return null
  if (!navigator.onLine) return <>{children}</>

  // not logged in
  if (!data) {
    return <FirstLocalSpaceGenerator>{children}</FirstLocalSpaceGenerator>
  }

  return (
    <EarlyAccessCodeProvider>
      <MnemonicGenerator>
        <RecoveryPhraseLoginProvider>{children}</RecoveryPhraseLoginProvider>
      </MnemonicGenerator>
    </EarlyAccessCodeProvider>
  )
}

const PageEditor = () => {
  const inited = useRef(false)
  useEffect(() => {
    if (inited.current) return
    inited.current = true
    appEmitter.emit('LOAD_CLOUD_SPACES')
  }, [])
  return (
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
  )
}

export default PageEditor

PageEditor.Layout = CommonLayout
