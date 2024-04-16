import { Box } from '@fower/react'
import { Button, Divider, modalController } from 'uikit'
import { ModalNames } from '@penx/constants'
import { SyncServerList } from './SyncServerList'
import { SyncServerModal } from './SyncServerModal/SyncServerModal'
import { SyncServerSelect } from './SyncServerSelect'

export function SyncServer() {
  return (
    <Box column gap10>
      <SyncServerModal />

      <SyncServerSelect />
      <Divider />

      <Box toCenterY toBetween>
        <Box text2XL mb4 fontBold>
          My sync servers
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
            Create
          </Button>
        </Box>
      </Box>

      <SyncServerList />
    </Box>
  )
}
