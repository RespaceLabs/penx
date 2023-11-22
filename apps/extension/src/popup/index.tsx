import { useState } from 'react'

import { Login } from '~/components/popup/login'
import { Main } from '~/pages/main'

function IndexPopup() {
  const [isLogin, setIsLogin] = useState<boolean>(true)

  const loginCallback = () => {
    console.log('loginCallback')
    setIsLogin(true)
  }

  return <>{isLogin ? <Main /> : <Login loginCallback={loginCallback} />}</>
}

export default IndexPopup
