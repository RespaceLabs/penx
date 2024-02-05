import { Box } from '@fower/react'
import { AccountBinding } from './AccountBinding'
import { PersonalToken } from './PersonalToken'

export function AccountSettings() {
  return (
    <Box p10 maxW-800>
      <Box text2XL mb4 fontBold>
        Account Settings
      </Box>

      <PersonalToken />
      <AccountBinding />
    </Box>
  )
}
