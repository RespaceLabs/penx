import { Box } from '@fower/react'
import { useModalContext } from 'uikit'
import { SettingsType } from '@penx/constants'
import { SyncServer } from '../../SyncServer/SyncServer'
import { AccountSettings } from '../AccountSettings/AccountSettings'
import { Backup } from '../Backup/Backup'
import { RecoveryPhrase } from '../RecoveryPhrase/RecoveryPhrase'

export const SettingsContent = () => {
  const { data } = useModalContext<string>()

  return (
    <Box p10 flex-1 overflowAuto>
      {data === SettingsType.ACCOUNT_SETTINGS && <AccountSettings />}
      {data === SettingsType.RECOVERY_PHRASE && <RecoveryPhrase />}
      {data === SettingsType.SYNC_BACKUP && <Backup />}
      {data === SettingsType.SYNC_SERVER && <SyncServer />}
    </Box>
  )
}
