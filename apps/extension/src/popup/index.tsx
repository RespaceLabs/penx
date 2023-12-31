import { Box } from '@fower/react'
import React from 'react'
import { Spinner } from 'uikit'

import { Login } from '~/components/popup/login'
import { TrpcProvider } from '~/components/TrpcProvider'
import { useSession } from '~/hooks/useSession'

import '../components/popup/globals.module.css'

import { initFower } from '@penx/app'
import { db } from '@penx/local-db'

import { Popup } from '~/components/popup/Popup'
import { useDB } from '~/hooks/useDB'

initFower()

function IndexPopup() {
  const { connected } = useDB()
  const { loading, data } = useSession()

  if (loading || !connected) {
    return (
      <Box w-300 h-300 toCenter>
        <Spinner />
      </Box>
    )
  }

  // TODO: should handle token expiration
  const isLogin = data?.userId

  const loginCallback = () => {
    console.log('loginCallback')
  }

  return <Popup></Popup>

  return (
    <>
      {isLogin ? (
        <TrpcProvider token={''}>
          <Popup />
        </TrpcProvider>
      ) : (
        <Login loginCallback={loginCallback} />
      )}
    </>
  )
}

export default IndexPopup
