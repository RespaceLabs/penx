import { PropsWithChildren, useEffect } from 'react'
import { Box } from '@fower/react'
import { useQuery } from '@tanstack/react-query'
import { get } from 'idb-keyval'
import { useSession } from 'next-auth/react'
import { MASTER_PASSWORD } from '@penx/constants'
import { getMnemonicFromLocal } from '@penx/mnemonic'
import { store } from '@penx/store'
import { RecoveryPhraseLogin } from './RecoveryPhraseLogin'

export function RecoveryPhraseLoginProvider({ children }: PropsWithChildren) {
  const { data: session, update } = useSession()

  const { data, isLoading, refetch } = useQuery(
    ['mnemonic', session?.secret],
    () => getMnemonicFromLocal(session?.secret!),
  )

  useEffect(() => {
    if (data) {
      store.user.setMnemonic(data)
    }
  }, [data])

  if (isLoading) return null

  if (!data) {
    return (
      <Box h-100vh toCenter>
        <RecoveryPhraseLogin refetch={refetch} />
      </Box>
    )
  }

  return <>{children}</>
}
