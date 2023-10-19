import { Box } from '@fower/react'
import { ConnectGitHub } from './ConnectGitHub'

export const SyncBox = () => {
  return (
    <Box px10 py10 bgWhite rounded2XL>
      <Box toCenterY toBetween gap2 mb8>
        <Box fontBold text3XL>
          Sync
        </Box>
      </Box>
      <Box>
        <ConnectGitHub />
      </Box>
    </Box>
  )
}
