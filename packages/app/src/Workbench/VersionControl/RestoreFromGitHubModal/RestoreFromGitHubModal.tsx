import { Box } from '@fower/react'
import { Modal, ModalCloseButton, ModalContent, ModalOverlay } from 'uikit'
import { ModalNames } from '@penx/constants'
import { RestoreFromGitHubForm } from './RestoreFromGitHubForm'

export const RestoreFromGitHubModal = () => {
  return (
    <Modal name={ModalNames.RESTORE_FROM_GITHUB} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent w={['96%', 600]} px={[20, 32]} py20>
        <ModalCloseButton />
        <Box column gapy4>
          <Box fontSemibold text2XL>
            Restore from GitHub
          </Box>
        </Box>
        <RestoreFromGitHubForm />
      </ModalContent>
    </Modal>
  )
}
