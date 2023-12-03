import { Box } from '@fower/react'
import { Trans } from '@lingui/macro'
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
import { useDatabaseContext } from '../../DatabaseContext'

const Footer = () => {
  const { data, close } = useModalContext<string>()
  const ctx = useDatabaseContext()

  async function deleteColumn() {
    await ctx.deleteColumn(data)
    close()
  }

  return (
    <Box toCenterY gap3>
      <ModalClose asChild>
        <Button colorScheme="white">
          <Trans>Cancel</Trans>
        </Button>
      </ModalClose>
      <Button colorScheme="red500" onClick={deleteColumn}>
        <Trans>Delete</Trans>
      </Button>
    </Box>
  )
}

export const DeleteColumnModal = () => {
  return (
    <Modal name={ModalNames.DELETE_COLUMN}>
      <ModalOverlay />
      <ModalContent w={[500]} column gap4 toCenterX>
        <ModalCloseButton />

        <ModalHeader mb2>
          <Trans>Are you sure delete it permanently?</Trans>
        </ModalHeader>

        <Box>
          <Trans>Once deleted, You can't undo this action.</Trans>
        </Box>
        <Footer />
      </ModalContent>
    </Modal>
  )
}
