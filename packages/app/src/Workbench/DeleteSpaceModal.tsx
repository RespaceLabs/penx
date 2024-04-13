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
import { useActiveSpace } from '@penx/hooks'
import { Node, Space } from '@penx/model'
import { store } from '@penx/store'
import { api } from '@penx/trpc-client'

const Footer = () => {
  const { close, data: space } = useModalContext<Space>()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  async function deleteSpace() {
    if (!name) return
    setLoading(true)
    try {
      await api.space.deleteById.mutate(space.id)
      await store.space.deleteSpace(space.id)
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
        placeholder={`Please type "${space.name}" to confirm`}
        onChange={(e) => setName(e.target.value)}
      />
      <Box gap3 toCenterY mt4>
        <ModalClose asChild>
          <Button colorScheme="white">Cancel</Button>
        </ModalClose>
        <Button
          colorScheme="red500"
          disabled={name !== space.name || loading}
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

      <Modal name={ModalNames.DELETE_SPACE}>
        <ModalOverlay />
        <ModalContent w={['100%', 500]} column gap4>
          <ModalCloseButton />

          <ModalHeader mb2>Are you sure delete it permanently?</ModalHeader>

          <Box>Once deleted, You can{"'"}t undo this action.</Box>
          <Footer />
        </ModalContent>
      </Modal>
    </Box>
  )
}
