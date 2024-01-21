import { Box } from '@fower/react'
import { CreateSyncServerModal } from './CreateSyncServerModal/CreateSyncServerModal'

export function SyncServer() {
  return (
    <Box p10>
      <Box text2XL mb4 fontBold>
        Sync Servers
      </Box>
      <Box toRight>
        <CreateSyncServerModal />
      </Box>
    </Box>
  )
}
