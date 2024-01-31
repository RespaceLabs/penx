import { useEffect } from 'react'
import { set } from 'idb-keyval'
import { signIn, signOut } from 'next-auth/react'
import { useDisconnect } from 'wagmi'
import { appEmitter } from '@penx/app'
import { PENX_SESSION_USER } from '@penx/constants'

export function EventHandler() {
  useEffect(() => {
    const handleSignOut = async () => {
      await set(PENX_SESSION_USER, null)
      await signOut()
    }
    appEmitter.on('SIGN_OUT', handleSignOut)

    const handleSignIn = () => {
      signIn('google')
    }
    appEmitter.on('SIGN_IN_GOOGLE', handleSignIn)

    return () => {
      appEmitter.off('SIGN_OUT', handleSignOut)
      appEmitter.off('SIGN_IN_GOOGLE', handleSignIn)
    }
  }, [])

  return null
}
