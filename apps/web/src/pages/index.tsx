import React, { useEffect } from 'react'
import { GetServerSideProps, GetStaticProps } from 'next'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import { EditorApp, HomePage } from '@penx/app'
import { SessionProvider } from '@penx/session'
import { WalletConnectProvider } from '~/components/WalletConnectProvider'
import { authOptions } from './api/auth/[...nextauth]'

const PageEditor = () => {
  return <HomePage></HomePage>
}

export default PageEditor

export const getServerSideProps: GetServerSideProps = async function (context) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (session) {
    return {
      redirect: {
        destination: '/editor',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
