import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalTrigger,
} from 'uikit'
import { IconDiscord } from '@penx/icons'
import { Marketplace } from './Marketplace'

export const MarketplaceModal = () => {
  return (
    <Modal>
      <ModalOverlay />
      <ModalTrigger>
        <Button colorScheme="gray500" variant="ghost" isSquare roundedFull>
          <IconDiscord gray500 />
        </Button>
      </ModalTrigger>
      <ModalContent w={[1000]} toLeft p6 h-800>
        <ModalCloseButton />
        <Marketplace />
      </ModalContent>
    </Modal>
  )
}
