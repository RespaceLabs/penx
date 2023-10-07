import { Box } from '@fower/react'
import { Code2 } from 'lucide-react'
import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalTrigger,
} from 'uikit'
import { ExtensionBuilder } from './ExtensionBuilder'

export const ExtensionBuilderModalModal = () => {
  return (
    <Modal>
      <ModalOverlay />
      <ModalTrigger>
        <Button colorScheme="gray500" variant="ghost" isSquare roundedFull>
          <Code2 />
        </Button>
      </ModalTrigger>
      <ModalContent w={[400]} p0 minH-600 maxH-600 flex-1 column>
        <ModalCloseButton />
        <ModalHeader px4 py3 borderBottom>
          <Box>Building a Extension</Box>
        </ModalHeader>
        <ExtensionBuilder />
      </ModalContent>
    </Modal>
  )
}
