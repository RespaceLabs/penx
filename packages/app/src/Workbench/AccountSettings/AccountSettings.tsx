import { Box } from '@fower/react'
import { EncryptionKey } from './EncryptionKey'
import { SyncBox } from './SyncBox/SyncBox'

export function AccountSettings() {
  //
  return (
    <Box p10>
      <Box text2XL mb4 fontBold>
        Account Settings
      </Box>
      <EncryptionKey />
      <SyncBox />
    </Box>
  )
}
