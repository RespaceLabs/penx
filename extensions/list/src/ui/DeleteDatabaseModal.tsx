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
import { db } from '@penx/local-db'
import { Node } from '@penx/model'
import { store } from '@penx/store'

interface Props {
  onDeleteColumn: (columnId: string) => Promise<void>
}

const Footer = () => {
  const { data } = useModalContext<Node>()
  async function deleteColumn() {
    await db.deleteDatabase(data.raw)
    store.node.selectDailyNote()
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

export const DeleteDatabaseModal = () => {
  return (
    <Modal name={ModalNames.DELETE_DATABASE}>
      <ModalOverlay />
      <ModalContent w={[500]} column gap4 toCenterX>
        <ModalCloseButton />

        <ModalHeader mb2>Are you sure delete it permanently?</ModalHeader>

        <Box>Once deleted, You can't undo this action.</Box>
        <Footer />
      </ModalContent>
    </Modal>
  )
}
