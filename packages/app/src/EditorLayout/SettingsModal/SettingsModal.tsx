import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalTrigger,
} from 'uikit'
import { IconSettings } from '@penx/icons'
import { SettingsContent } from './SettingsContent'
import { SettingsSidebar } from './SettingsSidebar'

export const SettingsModal = () => {
  return (
    <Modal>
      <ModalOverlay />
      <ModalTrigger>
        <Button colorScheme="gray500" variant="ghost" isSquare roundedFull>
          <IconSettings gray500 />
        </Button>
      </ModalTrigger>
      <ModalContent w={[1000]} toLeft p0 h-800>
        <ModalCloseButton />
        <SettingsSidebar />
        <SettingsContent />
      </ModalContent>
    </Modal>
  )
}
