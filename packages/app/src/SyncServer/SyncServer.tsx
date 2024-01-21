import { Box } from '@fower/react'
import { CreateSyncServerModal } from './CreateSyncServerModal/CreateSyncServerModal'
import { SyncServerList } from './SyncServerList'

export function SyncServer() {
  return (
    <Box p10>
      <Box toCenterY toBetween>
        <Box text2XL mb4 fontBold>
          Sync Servers
        </Box>
        <Box toRight>
          <CreateSyncServerModal />
        </Box>
      </Box>

      <SyncServerList />
    </Box>
  )
}
