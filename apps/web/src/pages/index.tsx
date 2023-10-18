import React from 'react'
import { EditorApp } from '@penx/app'
import { WalletConnectProvider } from '~/components/WalletConnectProvider'
import { api } from '~/utils/api'

const PageEditor = () => {
  // const { data } = api.user.all.useQuery()
  // console.log('data=============:', data)

  return (
    <WalletConnectProvider>
      <EditorApp />
    </WalletConnectProvider>
  )
}

export default PageEditor
