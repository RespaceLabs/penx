import { Box } from '@fower/react'
import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalTrigger,
} from 'uikit'
import { CreateSpaceForm } from './CreateSpaceForm'

export const CreateSpaceModal = () => {
  return (
    <Modal name="CREATE_SPACE_MODAL">
      <ModalOverlay />
      <ModalContent w={[520]} px8 py20>
        <ModalCloseButton />
        <Box column textCenter gapy4>
          <Box fontBold text4XL>
            Create new space
          </Box>
        </Box>
        <CreateSpaceForm />
      </ModalContent>
    </Modal>
  )
}
