import { Box } from '@fower/react'
import {
  Button,
  Modal,
  ModalClose,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useModalContext,
} from 'uikit'
import { ModalNames } from '@penx/constants'

interface Props {
  onDeleteColumn: (columnId: string) => Promise<void>
}

const Footer = ({ onDeleteColumn }: Props) => {
  const { data: columnId, close } = useModalContext<string>()
  async function deleteColumn() {
    await onDeleteColumn(columnId)
    close()
  }

  return (
    <Box toCenterY gap3>
      <ModalClose asChild>
        <Button colorScheme="white">Cancel</Button>
      </ModalClose>
      <Button colorScheme="red500" onClick={deleteColumn}>
        Delete
      </Button>
    </Box>
  )
}

export const DeleteColumnModal = ({ onDeleteColumn }: Props) => {
  return (
    <Modal name={ModalNames.DELETE_COLUMN}>
      <ModalOverlay />
      <ModalContent w={[500]} column gap4 toCenterX>
        <ModalCloseButton />

        <ModalHeader mb2>Are you sure delete it permanently?</ModalHeader>

        <Box>Once deleted, You can't undo this action.</Box>
        <Footer onDeleteColumn={onDeleteColumn} />
      </ModalContent>
    </Modal>
  )
}
