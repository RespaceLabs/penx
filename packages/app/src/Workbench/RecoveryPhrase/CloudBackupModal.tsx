import { Box } from '@fower/react'
import {
  Button,
  Modal,
  MODAL_OVERLAY_Z_INDEX,
  ModalClose,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalTrigger,
} from 'uikit'
import { IconGoogle } from '@penx/icons'
import { CloudBackupForm } from './CloudBackupForm'

export const CloudBackupModal = () => {
  return (
    <Modal>
      <ModalOverlay zIndex={MODAL_OVERLAY_Z_INDEX + 1} />
      <ModalTrigger>
        <Button colorScheme="black" size={56} gapX2 w-280 toBetween>
          <IconGoogle size={24} />
          <Box column gap1>
            <Box textBase fontSemibold>
              Google drive Connected
            </Box>
            <Box textXS fontLight>
              Start to backup
            </Box>
          </Box>
        </Button>
      </ModalTrigger>
      <ModalContent w={['100%', 500]} column gap4>
        <ModalCloseButton />

        <ModalHeader mb2>Create a password to secure your backup</ModalHeader>

        <Box gray500>
          This password is not recoverable, Make sure you choose a password you
          {"'"}ll remember.
        </Box>
        <CloudBackupForm />
      </ModalContent>
    </Modal>
  )
}
