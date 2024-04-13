import { Box } from '@fower/react'
import { Tag } from 'uikit'
import { useSession } from '@penx/session'
import { PersonalToken } from './PersonalToken'

export function AccountSettings() {
  const { data } = useSession()
  return (
    <Box>
      <Box toCenterY gap2>
        <Box text2XL fontBold>
          Account Settings
        </Box>

        <Tag variant="light" colorScheme="gray400">
          {data.userId}
        </Tag>
      </Box>

      <PersonalToken />
    </Box>
  )
}
