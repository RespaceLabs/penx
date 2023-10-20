import { Box } from '@fower/react'
import {
  Button,
  Modal,
  ModalClose,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from 'uikit'
import { ModalNames } from '@penx/constants'

export const LoginSuccessModal = () => {
  return (
    <Modal name={ModalNames.LOGIN_SUCCESS}>
      <ModalOverlay />
      <ModalContent w={[300]} px8 py20 column gap2 toCenterX>
        <ModalCloseButton />
        <Box column textCenter gapy4>
          <Box>Login success</Box>
        </Box>
        <Box>
          <ModalClose>
            <Button>Confirm</Button>
          </ModalClose>
        </Box>
      </ModalContent>
    </Modal>
  )
}
