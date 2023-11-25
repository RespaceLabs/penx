import { Box } from '@fower/react'
import { SyncBox } from './SyncBox/SyncBox'

export function AccountSettings() {
  return (
    <Box p10>
      <Box text2XL mb4 fontBold>
        Account Settings
      </Box>
      <SyncBox />
    </Box>
  )
}
