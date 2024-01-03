import React from 'react'
import { GetStaticProps } from 'next'
import { EditorApp, HomePage } from '@penx/app'
import { SessionProvider } from '@penx/session'
import { WalletConnectProvider } from '~/components/WalletConnectProvider'
import { authOptions } from './api/auth/[...nextauth]'

const PageEditor = () => {
  return <HomePage></HomePage>
}

export default PageEditor
