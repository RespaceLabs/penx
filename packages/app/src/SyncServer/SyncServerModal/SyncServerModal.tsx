import { Box } from '@fower/react'
import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalTrigger,
} from 'uikit'
import { ModalNames } from '@penx/constants'
import { SyncServerForm } from './SyncServerForm'

export const SyncServerModal = () => {
  return (
    <Modal name={ModalNames.SYNC_SERVER}>
      <ModalOverlay />
      <ModalContent w={['96%', 600]} px={[20, 32]} py20>
        <ModalCloseButton />
        <Box column gapy4>
          <Box fontSemibold text2XL>
            Create sync server
          </Box>
        </Box>
        <SyncServerForm />
      </ModalContent>
    </Modal>
  )
}
