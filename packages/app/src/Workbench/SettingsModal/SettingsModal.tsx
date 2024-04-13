import { Settings } from 'lucide-react'
import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalTrigger,
} from 'uikit'
import { ModalNames } from '@penx/constants'
import { SettingsContent } from './SettingsContent'
import { SettingsSidebar } from './SettingsSidebar'

export const SettingsModal = () => {
  return (
    <Modal name={ModalNames.SETTINGS}>
      <ModalOverlay />
      <ModalContent
        w={['100%', 860]}
        toBetween
        p0--i
        h={['100%', '100%', 800]}
        flexDirection={['column', 'column', 'row']}
      >
        <ModalCloseButton />
        <SettingsSidebar />
        <SettingsContent />
      </ModalContent>
    </Modal>
  )
}
