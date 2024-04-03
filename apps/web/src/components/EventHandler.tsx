import { useEffect } from 'react'
import { set } from 'idb-keyval'
import { signIn, signOut } from 'next-auth/react'
import { appEmitter } from '@penx/event'
import { clearAuthorizedUser } from '@penx/storage'

export function EventHandler() {
  useEffect(() => {
    const handleSignOut = async () => {
      clearAuthorizedUser()
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
