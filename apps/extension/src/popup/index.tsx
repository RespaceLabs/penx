import { Box } from '@fower/react'
import React from 'react'
import { Spinner } from 'uikit'

import { Login } from '~/components/popup/login'
import { TrpcProvider } from '~/components/TrpcProvider'
import { useSession } from '~/hooks/useSession'
import { Main } from '~/pages/main'

function IndexPopup() {
  const { loading, data } = useSession()

  if (loading || !data) {
    return (
      <Box w-100p toCenter>
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
          <Main />
        </TrpcProvider>
      ) : (
        <Login loginCallback={loginCallback} />
      )}
    </>
  )
}

export default IndexPopup
