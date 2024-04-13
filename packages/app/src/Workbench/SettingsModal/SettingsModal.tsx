import { useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  Modal,
  ModalCloseButton,
  ModalContent,
  modalController,
  ModalOverlay,
} from 'uikit'
import { ModalNames, SettingsType } from '@penx/constants'
import { SettingsContent } from './SettingsContent'
import { SettingsSidebar } from './SettingsSidebar'

export const SettingsModal = () => {
  const { query } = useRouter()
  const from = query.from as 'google-oauth' | 'github-oauth'
  const isFromOauth = from === 'google-oauth' || from === 'github-oauth'
  useEffect(() => {
    if (isFromOauth) {
      modalController.open(ModalNames.SETTINGS, {
        type: SettingsType.SYNC_BACKUP,
      })
    }
  }, [isFromOauth])

  return (
    <Modal
      name={ModalNames.SETTINGS}
      onClose={() => {
        if (isFromOauth) {
          history.replaceState(null, null as any, '/')
        }
      }}
    >
      <ModalOverlay />
      <ModalContent
        w={['100%', '100%', '90%', 1000, 1200]}
        mx-auto
        toBetween
        p0--i
        // h={['100%', '100%', 800]}
        h={[760]}
        flexDirection={['column', 'column', 'row']}
        overflowHidden
      >
        <ModalCloseButton />
        <SettingsSidebar />
        <SettingsContent />
      </ModalContent>
    </Modal>
  )
}
