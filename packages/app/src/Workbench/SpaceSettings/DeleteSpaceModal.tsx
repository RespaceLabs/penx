import { useState } from 'react'
import { Box } from '@fower/react'
import { Trans } from '@lingui/macro'
import {
  Button,
  Input,
  Modal,
  ModalClose,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalTrigger,
  useModalContext,
} from 'uikit'
import { ModalNames } from '@penx/constants'
import { useSpaces } from '@penx/hooks'
import { Node } from '@penx/model'
import { store } from '@penx/store'

const Footer = () => {
  const { close } = useModalContext<Node>()
  const [name, setName] = useState('')
  const { activeSpace } = useSpaces()

  async function deleteSpace() {
    if (!name) return
    if (activeSpace.isCloud) {
      console.log('TODO?.....')
    } else {
      console.log('activeSpace:', activeSpace)
    }
    close()
  }
  return (
    <Box>
      <Input
        w-80p
        placeholder={`Please type ${activeSpace.name} to confirm`}
        onChange={(e) => setName(e.target.value)}
      />
      <Box gap3 toCenterY mt4>
        <ModalClose asChild>
          <Button colorScheme="white">
            <Trans>Cancel</Trans>
          </Button>
        </ModalClose>
        <Button
          colorScheme="red500"
          disabled={name !== activeSpace.name}
          onClick={deleteSpace}
        >
          <Trans>Delete</Trans>
        </Button>
      </Box>
    </Box>
  )
}

export const DeleteSpaceModal = () => {
  return (
    <Box>
      <Box textLG fontMedium mb4>
        Delete Space
      </Box>

      <Modal name={ModalNames.DELETE_NODE}>
        <ModalTrigger>
          <Button variant="outline" colorScheme="red500">
            Delete entire space
          </Button>
        </ModalTrigger>
        <ModalOverlay />
        <ModalContent w={[500]} column gap4>
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
    </Box>
  )
}
