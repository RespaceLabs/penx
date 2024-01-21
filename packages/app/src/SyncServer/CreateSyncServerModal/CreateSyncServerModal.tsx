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
import { CreateSyncServerForm } from './CreateSyncServerForm'

export const CreateSyncServerModal = () => {
  return (
    <Modal>
      <ModalTrigger>
        <Button>Create sync server</Button>
      </ModalTrigger>
      <ModalOverlay />
      <ModalContent w={['96%', 600]} px={[20, 32]} py20>
        <ModalCloseButton />
        <Box column gapy4>
          <Box fontSemibold text2XL>
            Create sync server
          </Box>
        </Box>
        <CreateSyncServerForm />
      </ModalContent>
    </Modal>
  )
}
