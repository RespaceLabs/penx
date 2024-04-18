import { PropsWithChildren, useEffect } from 'react'
import { Box } from '@fower/react'
import { useQuery } from '@tanstack/react-query'
import { Button, modalController } from 'uikit'
import { ModalNames } from '@penx/constants'
import { appEmitter } from '@penx/event'
import { getMnemonicFromLocal } from '@penx/mnemonic'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import { DeleteAccountModal } from './DeleteAccountModal'
import { RecoveryPhraseLogin } from './RecoveryPhraseLogin'

export function RecoveryPhraseLoginProvider({ children }: PropsWithChildren) {
  const { data: session } = useSession()

  const { data, isLoading, refetch } = useQuery(
    ['mnemonic', session?.userId],
    () => getMnemonicFromLocal(session?.userId!),
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
        <Box column toCenter gap5>
          <RecoveryPhraseLogin refetch={refetch} />

          <Box column gap2>
            <Box gray500 textCenter textXS>
              Have forgotten the recovery phrase permanently?
            </Box>
            <Box toCenter gap1 w-100p opacity-60>
              <Button
                size="sm"
                variant="light"
                colorScheme="gray900"
                w-100
                onClick={() => {
                  appEmitter.emit('SIGN_OUT')
                }}
              >
                Logout
              </Button>
              <Button
                size="sm"
                w-100
                colorScheme="red500"
                onClick={() => modalController.open(ModalNames.DELETE_ACCOUNT)}
              >
                Delete Account
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }

  return <>{children}</>
}
