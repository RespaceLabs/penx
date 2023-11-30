import { Box } from '@fower/react'
import { Modal, ModalCloseButton, ModalContent, ModalOverlay } from 'uikit'
import { ModalNames } from '@penx/constants'
import { CreateSpaceForm } from './CreateSpaceForm'

export const CreateSpaceModal = () => {
  return (
    <Modal name={ModalNames.CREATE_SPACE}>
      <ModalOverlay />
      <ModalContent w={['96%', 600]} px={[20, 32]} py20>
        <ModalCloseButton />
        <Box column gapy4>
          <Box fontSemibold text2XL>
            Create new space
          </Box>
        </Box>
        <CreateSpaceForm />
      </ModalContent>
    </Modal>
  )
}
