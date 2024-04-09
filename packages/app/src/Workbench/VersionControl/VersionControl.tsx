import { Box } from '@fower/react'
import { Card, Divider } from 'uikit'
import { useUser } from '@penx/hooks'
import { GitHubBackup } from './GitHubBackup'
import { GoogleBackup } from './GoogleBackup'

export function VersionControl() {
  return (
    <Box column gap10 px10 relative>
      <GoogleBackup></GoogleBackup>
      <Divider></Divider>
      <GitHubBackup></GitHubBackup>
    </Box>
  )
}
