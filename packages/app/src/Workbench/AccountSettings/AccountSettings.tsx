import { Box } from '@fower/react'
import { Button } from 'uikit'
import { ClientOnly } from '../../components/ClientOnly'
import { AccountBinding } from './AccountBinding'
import { PersonalToken } from './PersonalToken'
import { SyncBox } from './SyncBox/SyncBox'

export function AccountSettings() {
  return (
    <Box p10 maxW-800>
      <Box text2XL mb4 fontBold>
        Account Settings
      </Box>

      <PersonalToken />
      <AccountBinding />
      <SyncBox />
    </Box>
  )
}
