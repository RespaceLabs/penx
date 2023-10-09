import { Settings } from 'lucide-react'
import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalTrigger,
} from 'uikit'
import { SettingsContent } from './SettingsContent'
import { SettingsSidebar } from './SettingsSidebar'

export const SettingsModal = () => {
  return (
    <Modal>
      <ModalOverlay />
      <ModalTrigger>
        <Button
          size="sm"
          colorScheme="gray500"
          variant="ghost"
          isSquare
          roundedFull
        >
          <Settings />
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
