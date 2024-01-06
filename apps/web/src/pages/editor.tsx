import React from 'react'
import { GetServerSideProps, GetStaticProps } from 'next'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import { EditorApp } from '@penx/app'
import { SessionProvider } from '@penx/session'
import { authOptions } from './api/auth/[...nextauth]'

const PageEditor = () => {
  const session = useSession()

  return (
    <SessionProvider
      value={{
        data: session.data as any,
        loading: session.status === 'loading',
      }}
    >
      <EditorApp />
    </SessionProvider>
  )
}

export default PageEditor

export const getServerSideProps: GetServerSideProps = async function (context) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}
