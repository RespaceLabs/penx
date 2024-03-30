import { Box } from '@fower/react'
import {
  Button,
  Modal,
  ModalClose,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useModalContext,
} from 'uikit'
import { ModalNames } from '@penx/constants'

const Footer = () => {
  const { close } = useModalContext<string>()
  async function deleteAccount() {
    alert('delete account')
    close()
  }

  return (
    <Box toCenterY gap3>
      <ModalClose asChild>
        <Button colorScheme="white">Cancel</Button>
      </ModalClose>
      <Button colorScheme="red500" onClick={deleteAccount}>
        Delete
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
          Once deleted, all your data will be removed, You can't undo this
          action.
        </Box>
        <Footer />
      </ModalContent>
    </Modal>
  )
}
