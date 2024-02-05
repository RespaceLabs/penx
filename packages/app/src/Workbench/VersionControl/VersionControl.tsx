import { Box } from '@fower/react'
import { SyncBox } from './SyncBox/SyncBox'
import { VersionRestore } from './VersionRestore'

export function VersionControl() {
  return (
    <Box p10 relative>
      <Box toBetween>
        <Box text2XL mb4 fontBold>
          Version Control
        </Box>
      </Box>

      <Box>
        <SyncBox />

        <Box pt10>
          <VersionRestore />
        </Box>
      </Box>
    </Box>
  )
}
