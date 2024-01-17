import React from 'react'
import { GetServerSideProps, GetStaticProps } from 'next'
import { getServerSession } from 'next-auth'
import { HomePage } from '@penx/app'
import { authOptions } from './api/auth/[...nextauth]'

const PageEditor = (props: any) => {
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
    props: {
      session,
    },
  }
}
