import { Box } from '@fower/react'
import { useModal } from 'easy-modal'
import { Modal, ModalCloseButton, ModalContent, ModalOverlay } from 'uikit'

export const ModalTest = () => {
  const { register } = useModal()

  return (
    <Modal {...register('bone-ui')}>
      <ModalOverlay />
      <ModalContent w={[600]}>
        <ModalCloseButton />
        <Box px8 py6>
          <Box>Modal Test</Box>
          <Box>Modal Test</Box>
          <Box>Modal Test</Box>
          <Box>Modal Test</Box>
        </Box>
      </ModalContent>
    </Modal>
  )
}
