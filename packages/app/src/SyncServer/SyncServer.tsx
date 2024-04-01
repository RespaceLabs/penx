import { Box } from '@fower/react'
import { Button, modalController } from 'uikit'
import { ModalNames } from '@penx/constants'
import { SyncServerList } from './SyncServerList'
import { SyncServerModal } from './SyncServerModal/SyncServerModal'

export function SyncServer() {
  return (
    <Box p10>
      <SyncServerModal />
      <Box toCenterY toBetween>
        <Box text2XL mb4 fontBold>
          Sync Servers
        </Box>
        <Box toRight>
          <Button
            colorScheme="black"
            onClick={() => {
              modalController.open(ModalNames.SYNC_SERVER, {
                isEditing: false,
                isLoading: false,
              })
            }}
          >
            Create sync server
          </Button>
        </Box>
      </Box>

      <SyncServerList />
    </Box>
  )
}
