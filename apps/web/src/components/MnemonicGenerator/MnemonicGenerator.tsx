import { PropsWithChildren, useCallback, useEffect, useRef } from 'react'
import { Box } from '@fower/react'
import { useSession } from 'next-auth/react'
import { Spinner, toast } from 'uikit'
import { useMnemonic } from '@penx/hooks'
import {
  getMnemonicFromLocal,
  getNewMnemonic,
  getPublicKey,
  setMnemonicToLocal,
} from '@penx/mnemonic'
import { store } from '@penx/store'
import { api } from '@penx/trpc-client'

export function MnemonicGenerator({ children }: PropsWithChildren) {
  const { data, update } = useSession()
  const doingRef = useRef(false)
  const { mnemonic } = useMnemonic()

  const initMnemonic = useCallback(async () => {
    try {
      const secret = await api.user.getMySecret.query()
      const mnemonic = await getNewMnemonic()
      await setMnemonicToLocal(secret!, mnemonic)
      const publicKey = getPublicKey(mnemonic)
      await api.user.updatePublicKey.mutate({ publicKey })
      await update({ publicKey })
      store.user.setMnemonic(mnemonic)
    } catch (error) {
      // TODO: handle error
      console.log('=====error:', error)
      toast.error('Init account failed, please try to refresh.')
    }
  }, [update])

  useEffect(() => {
    if (data?.publicKey || doingRef.current) return

    doingRef.current = true
    initMnemonic()
  }, [data, initMnemonic])

  useEffect(() => {
    if (!data?.userId) return
    initMnemonicToStore(data.secret)
  }, [data])

  async function initMnemonicToStore(secret: string) {
    let mySecret = secret || (await api.user.getMySecret.query())
    const mnemonic = await getMnemonicFromLocal(mySecret)
    store.user.setMnemonic(mnemonic)
  }

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

  if (!mnemonic) return null

  return <>{children}</>
}
