import { Box } from '@fower/react'
import React from 'react'
import { Spinner } from 'uikit'

import { Login } from '~/components/popup/login'
import { TrpcProvider } from '~/components/TrpcProvider'
import { useSession } from '~/hooks/useSession'

import '../components/popup/globals.module.css'

import { Popup } from '~/components/popup/Popup'

function IndexPopup() {
  const { loading, data } = useSession()

  if (loading) {
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

  return (
    <>
      {isLogin ? (
        <TrpcProvider token={data.accessToken}>
          <Popup />
        </TrpcProvider>
      ) : (
        <Login loginCallback={loginCallback} />
      )}
    </>
  )
}

export default IndexPopup
