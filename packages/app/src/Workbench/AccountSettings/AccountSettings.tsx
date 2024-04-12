import { Box } from '@fower/react'
import { PersonalToken } from './PersonalToken'

export function AccountSettings() {
  return (
    <Box>
      <Box text2XL mb4 fontBold>
        Account Settings
      </Box>

      <PersonalToken />
    </Box>
  )
}
