import React from 'react'
import { EditorApp } from '@penx/app'
import { WalletConnectProvider } from '~/components/WalletConnectProvider'

const PageEditor = () => {
  return (
    <WalletConnectProvider>
      <EditorApp />
    </WalletConnectProvider>
  )
}

export default PageEditor
