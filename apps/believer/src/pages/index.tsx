import React from 'react'
import { Box } from '@fower/react'
import { BelieverNFT } from '~/components/BelieverNFT/BelieverNFT'
import { ClientOnly } from '~/components/ClientOnly'
import { WalletConnectProvider } from '~/components/WalletConnectProvider'

const PageHome = () => {
  return (
    <ClientOnly>
      <WalletConnectProvider>
        <BelieverNFT />
      </WalletConnectProvider>
    </ClientOnly>
  )
}

export default PageHome
