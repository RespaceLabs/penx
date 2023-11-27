import { Box } from '@fower/react'
import { useState } from 'react'
import { Spinner } from 'uikit'

import { Login } from '~/components/popup/login'
import { useSession } from '~/hooks/useSession'
import { Main } from '~/pages/main'

function IndexPopup() {
  const [_, setIsLogin] = useState<boolean>(false)

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
    setIsLogin(true)
  }

  return <>{isLogin ? <Main /> : <Login loginCallback={loginCallback} />}</>
}

export default IndexPopup
