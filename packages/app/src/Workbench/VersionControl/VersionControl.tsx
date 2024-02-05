import { Box } from '@fower/react'
import { MyPoint } from './MyPoint'
import { SyncBox } from './SyncBox/SyncBox'

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
        {/* <MyPoint /> */}
        {/* <MintPointButton /> */}
      </Box>
    </Box>
  )
}
