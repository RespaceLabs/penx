import { PropsWithChildren, useState } from 'react'
import { Box } from '@fower/react'
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
  Spinner,
  toast,
  useModalContext,
} from 'uikit'
import { ModalNames } from '@penx/constants'
import { useSpaces } from '@penx/hooks'
import { Node } from '@penx/model'
import { store } from '@penx/store'
import { trpc } from '@penx/trpc-client'

const Footer = () => {
  const { close } = useModalContext<Node>()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const { activeSpace } = useSpaces()

  async function deleteSpace() {
    if (!name) return
    setLoading(true)
    try {
      await trpc.space.deleteById.mutate(activeSpace.id)
      await store.space.deleteSpace(activeSpace.id)
      close()
    } catch (error) {
      console.log('=========error:', error)
      toast.error('Failed to delete space')
    }

    setLoading(false)
  }
  return (
    <Box>
      <Input
        w-80p
        placeholder={`Please type "${activeSpace.name}" to confirm`}
        onChange={(e) => setName(e.target.value)}
      />
      <Box gap3 toCenterY mt4>
        <ModalClose asChild>
          <Button colorScheme="white">Cancel</Button>
        </ModalClose>
        <Button
          colorScheme="red500"
          disabled={name !== activeSpace.name || loading}
          onClick={deleteSpace}
        >
          {loading && <Spinner white square4 />}
          <Box>Delete</Box>
        </Button>
      </Box>
    </Box>
  )
}

export const DeleteSpaceModal = ({ children }: PropsWithChildren) => {
  return (
    <Box>
      <Box textLG fontMedium mb4>
        Delete Space
      </Box>

      <Modal name={ModalNames.DELETE_NODE}>
        {!children && (
          <ModalTrigger>
            <Button variant="outline" colorScheme="red500">
              Delete entire space
            </Button>
          </ModalTrigger>
        )}

        {!!children && <ModalTrigger>{children}</ModalTrigger>}

        <ModalOverlay />
        <ModalContent w={[500]} column gap4>
          <ModalCloseButton />

          <ModalHeader mb2>Are you sure delete it permanently?</ModalHeader>

          <Box>Once deleted, You can't undo this action.</Box>
          <Footer />
        </ModalContent>
      </Modal>
    </Box>
  )
}
