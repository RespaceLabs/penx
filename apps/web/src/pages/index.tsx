import React from 'react'
import { GetStaticProps } from 'next'
import { EditorApp } from '@penx/app'
import { WalletConnectProvider } from '~/components/WalletConnectProvider'
import { loadCatalog } from '~/utils'

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

export const getStaticProps: GetStaticProps = async (ctx) => {
  const translation = await loadCatalog(ctx.locale!)
  return {
    props: {
      translation,
    },
  }
}
