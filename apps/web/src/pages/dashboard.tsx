import React from 'react'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import { Dashboard } from '@penx/app'
import { SessionProvider } from '@penx/session'
import { authOptions } from './api/auth/[...nextauth]'

export default function DashboardPage() {
  const { data: session, status } = useSession()

  return (
    <SessionProvider
      value={{
        data: session as any,
        loading: status === 'loading',
      }}
    >
      <Dashboard userId={session?.userId as string} />
    </SessionProvider>
  )
}

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
