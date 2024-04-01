import { Box } from '@fower/react'
import { Button } from 'uikit'
import { useUser } from '@penx/hooks'
import { IconGitHub } from '@penx/icons'
import { useSession } from '@penx/session'
import { store } from '@penx/store'

export function SetupGitHubButton() {
  const { data } = useSession()
  const { user } = useUser()

  if (!data || user?.repo) return null

  return (
    <Button
      size="lg"
      variant="light"
      colorScheme="gray800"
      px0
      w-100p
      onClick={() => {
        store.router.routeTo('VERSION_CONTROL')
      }}
    >
      <IconGitHub size={24} gray500 />
      <Box column>
        <Box>Setup GitHub backup</Box>
        <Box textXS gray400>
          It is important for data security
        </Box>
      </Box>
    </Button>
  )
}
