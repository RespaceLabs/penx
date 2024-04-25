import { Box, styled } from '@fower/react'
import { Drawer } from 'vaul'
import { SettingsType } from '@penx/constants'
import { useSettingDrawer } from '@penx/hooks'
import { SyncServer } from '../../SyncServer/SyncServer'
import { AccountSettings } from '../AccountSettings/AccountSettings'
import { Backup } from '../Backup/Backup'
import { RecoveryPhrase } from '../RecoveryPhrase/RecoveryPhrase'
import { SpaceSettings } from '../SpaceSettings/SpaceSettings'

const DrawerOverlay = styled(Drawer.Overlay)
const DrawerContent = styled(Drawer.Content)

export const SettingsDrawer = () => {
  const { isOpen, type, spaceId, close, open } = useSettingDrawer()

  return (
    <Drawer.Root
      shouldScaleBackground
      open={isOpen}
      onOpenChange={(o) => {
        if (o) {
          open(type, spaceId)
        } else {
          close()
        }
      }}
    >
      <Drawer.Portal>
        <DrawerOverlay fixed bgBlack--T60 zIndex-100 css={{ inset: 0 }} />
        <DrawerContent
          overflowHidden
          bgWhite
          column
          roundedTop2XL
          outlineNone
          // h={`calc(100vh - 40px)`}
          h-94vh
          fixed
          bottom-0
          left-0
          right-0
          zIndex-101
          p6

          // overflowHidden
        >
          {type === SettingsType.ACCOUNT_SETTINGS && <AccountSettings />}
          {type === SettingsType.RECOVERY_PHRASE && <RecoveryPhrase />}
          {type === SettingsType.SYNC_BACKUP && <Backup />}
          {type === SettingsType.SYNC_SERVER && <SyncServer />}
          {type === SettingsType.SPACE && <SpaceSettings spaceId={spaceId} />}
        </DrawerContent>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
