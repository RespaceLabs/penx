import { Box } from '@fower/react'
import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useModalContext,
} from 'uikit'
import { ModalNames } from '@penx/constants'
import { SyncServerForm } from './SyncServerForm'
import { SyncServerModalData } from './useSyncServerForm'

export const SyncServerModal = () => {
  const { data } = useModalContext<SyncServerModalData>()
  return (
    <Modal name={ModalNames.SYNC_SERVER}>
      <ModalOverlay />
      <ModalContent w={['100%', 600]} px={[20, 32]} py20>
        <ModalCloseButton />
        <SyncServerForm />
      </ModalContent>
    </Modal>
  )
}
