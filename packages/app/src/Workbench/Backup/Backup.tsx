import { Box } from '@fower/react'
import { Card, Divider } from 'uikit'
import { useUser } from '@penx/hooks'
import { GitHubBackup } from './GitHubBackup'
import { GoogleBackup } from './GoogleBackup'

export function Backup() {
  const { user } = useUser()

  if (!user.raw) return

  return (
    <Box column gap10 px={[20, 40, 40]} relative pt={[20, 50]}>
      <GoogleBackup></GoogleBackup>
      <Divider></Divider>
      <GitHubBackup></GitHubBackup>
    </Box>
  )
}
