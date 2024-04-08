import { Box } from '@fower/react'
import { Trash2 } from 'lucide-react'
import {
  Button,
  Modal,
  ModalClose,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalTrigger,
  useModalContext,
} from 'uikit'
import { api, trpc } from '@penx/trpc-client'

interface Props {
  syncServerId: string
}

const Footer = ({ syncServerId }: Props) => {
  const { refetch } = trpc.syncServer.mySyncServers.useQuery()
  const { close, data } = useModalContext<boolean>()
  async function deleteSyncServer() {
    await api.syncServer.deleteById.mutate(syncServerId)
    await refetch()
    close()
  }

  return (
    <Box toCenterY gap3>
      <ModalClose asChild>
        <Button colorScheme="white">Cancel</Button>
      </ModalClose>
      <Button colorScheme="red500" onClick={deleteSyncServer}>
        Delete
      </Button>
    </Box>
  )
}

export const DeleteSyncServerModal = ({ syncServerId }: Props) => {
  return (
    <Modal>
      <ModalOverlay />
      <ModalTrigger>
        <Button isSquare size={28} variant="light" colorScheme="red500">
          <Trash2 size={16}></Trash2>
        </Button>
      </ModalTrigger>
      <ModalContent w={['100%', 500]} column gap4 toCenterX>
        <ModalCloseButton />

        <ModalHeader mb2>Are you sure delete it permanently?</ModalHeader>

        <Box>Once deleted, You can't undo this action.</Box>
        <Footer syncServerId={syncServerId} />
      </ModalContent>
    </Modal>
  )
}
