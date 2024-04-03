import { Box } from '@fower/react'
import {
  Button,
  Modal,
  ModalClose,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useModalContext,
} from 'uikit'
import { ModalNames } from '@penx/constants'
import { appEmitter } from '@penx/event'
import { api, trpc } from '@penx/trpc-client'

const Footer = () => {
  const { close } = useModalContext<string>()
  const { isLoading, mutateAsync } = trpc.user.deleteAccount.useMutation()
  async function deleteAccount() {
    await mutateAsync()

    appEmitter.emit('SIGN_OUT')
    close()
  }

  return (
    <Box toCenterY gap3>
      <ModalClose asChild>
        <Button colorScheme="white">Cancel</Button>
      </ModalClose>
      <Button colorScheme="red500" disabled={isLoading} onClick={deleteAccount}>
        {isLoading && <Spinner white square4 />}
        <Box>Delete</Box>
      </Button>
    </Box>
  )
}

export const DeleteAccountModal = () => {
  return (
    <Modal name={ModalNames.DELETE_ACCOUNT}>
      <ModalOverlay />
      <ModalContent w={['100%', 560]} column gap4 toCenterX textCenter>
        <ModalCloseButton />

        <ModalHeader mb2>
          Are you sure delete your account permanently?
        </ModalHeader>

        <Box w-70p>
          Once deleted, all your data will be removed, You can{`'`}t undo this
          action.
        </Box>
        <Footer />
      </ModalContent>
    </Modal>
  )
}
