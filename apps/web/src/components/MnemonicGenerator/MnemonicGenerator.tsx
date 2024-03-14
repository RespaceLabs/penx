import { PropsWithChildren, useCallback, useEffect, useRef } from 'react'
import { Box } from '@fower/react'
import { useSession } from 'next-auth/react'
import { init } from 'next/dist/compiled/webpack/webpack'
import { Spinner } from 'uikit'
import {
  getNewMnemonic,
  getPublicKey,
  setMnemonicToLocal,
} from '@penx/mnemonic'
import { api } from '@penx/trpc-client'

export function MnemonicGenerator({ children }: PropsWithChildren) {
  const { data, update } = useSession()
  const doingRef = useRef(false)

  const initMnemonic = useCallback(async () => {
    try {
      const secret = await api.user.getMySecret.query()
      const mnemonic = await getNewMnemonic()
      await setMnemonicToLocal(secret!, mnemonic)
      const publicKey = await getPublicKey(mnemonic)
      await api.user.updatePublicKey.mutate({ publicKey })
      await update({ publicKey })
    } catch (error) {
      console.log('=====error:', error)
      // TODO: handle error
    }
  }, [update])

  useEffect(() => {
    if (data?.publicKey || doingRef.current) return
    doingRef.current = true
    initMnemonic()
  }, [data, initMnemonic])

  if (!data?.publicKey) {
    return (
      <Box h-100vh toCenter>
        <Box toCenterY gap2>
          <Spinner square5 />
          <Box>Account initializing...</Box>
        </Box>
      </Box>
    )
  }

  return <>{children}</>
}
