import { PropsWithChildren, useEffect } from 'react'
import { Box } from '@fower/react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { Button, modalController } from 'uikit'
import { appEmitter } from '@penx/app'
import { ModalNames } from '@penx/constants'
import { getMnemonicFromLocal } from '@penx/mnemonic'
import { store } from '@penx/store'
import { DeleteAccountModal } from './DeleteAccountModal'
import { RecoveryPhraseLogin } from './RecoveryPhraseLogin'

export function RecoveryPhraseLoginProvider({ children }: PropsWithChildren) {
  const { data: session } = useSession()

  const { data, isLoading, refetch } = useQuery(
    ['mnemonic', session?.secret],
    () => getMnemonicFromLocal(session?.secret!),
  )

  useEffect(() => {
    if (data) {
      // console.log('monic========data:', data)
      store.user.setMnemonic(data)
    }
  }, [data])

  if (isLoading) return null

  if (!data) {
    return (
      <Box h-100vh toCenter column toBetween py4>
        <DeleteAccountModal />
        <Box flex-1 toCenter>
          <RecoveryPhraseLogin refetch={refetch} />
        </Box>

        <Box>
          <Box gray500 textCenter>
            Have forgotten the recovery phrase permanently?
          </Box>
          <Box toCenter gap2 w-100p mt4 opacity-60>
            <Button
              variant="outline"
              colorScheme="black"
              w-180
              onClick={() => {
                appEmitter.emit('SIGN_OUT')
              }}
            >
              Logout
            </Button>
            <Button
              w-180
              colorScheme="red500"
              onClick={() => modalController.open(ModalNames.DELETE_ACCOUNT)}
            >
              Delete Account
            </Button>
          </Box>
        </Box>
      </Box>
    )
  }

  return <>{children}</>
}
