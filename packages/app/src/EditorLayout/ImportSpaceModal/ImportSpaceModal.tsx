import { Box } from '@fower/react'
import { Modal, ModalCloseButton, ModalContent, ModalOverlay } from 'uikit'
import { ModalNames } from '@penx/constants'
import { ImportSpaceForm } from './ImportSpaceForm'

export const ImportSpaceModal = () => {
  return (
    <Modal name={ModalNames.IMPORT_SPACE}>
      <ModalOverlay />
      <ModalContent w={[520]} px8 py20>
        <ModalCloseButton />
        <Box column textCenter gapy4>
          <Box fontSemibold text3XL>
            Import new space
          </Box>
        </Box>
        <ImportSpaceForm />
      </ModalContent>
    </Modal>
  )
}
