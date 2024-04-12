import { Box } from '@fower/react'
import { Copy, Pencil } from 'lucide-react'
import { Button, modalController, Spinner, toast } from 'uikit'
import { ModalNames } from '@penx/constants'
import { useCopyToClipboard } from '@penx/shared'
import { api, trpc } from '@penx/trpc-client'
import { DeleteSyncServerModal } from './DeleteSyncServerModal'

export function SyncServerList() {
  const { isLoading, data = [] } = trpc.syncServer.mySyncServers.useQuery()

  const { copy } = useCopyToClipboard()

  if (isLoading) {
    return (
      <Box toCenter h-60vh>
        <Spinner />
      </Box>
    )
  }

  if (!data.length) {
    return (
      <Box h-80vh toCenter>
        <Box gray400>No sync server</Box>
      </Box>
    )
  }

  return (
    <Box mt10>
      <Box column gap1 grid gridTemplateColumns={[1, 1, 1, 2, 2]} gap4>
        {data?.map((item) => (
          <Box key={item.id} column gap3 border borderGray100 rounded3XL p5>
            <Box toCenterY toBetween>
              <Box textXL fontBold>
                {item.name}
              </Box>

              <Box toCenterY gap2>
                <Button
                  isSquare
                  size={28}
                  variant="light"
                  onClick={() => {
                    modalController.open(ModalNames.SYNC_SERVER, {
                      isEditing: true,
                      isLoading: false,
                      syncServer: item,
                    })
                  }}
                >
                  <Pencil size={16}></Pencil>
                </Button>
                <DeleteSyncServerModal syncServerId={item.id} />
              </Box>
            </Box>

            <Box column gap1>
              <Box gray500 textXS>
                Token
              </Box>
              <Box toCenterY gap2>
                <Box textBase>{item.token}</Box>

                <Button
                  isSquare
                  size={28}
                  variant="ghost"
                  colorScheme="gray500"
                  onClick={() => {
                    copy(item.token)
                    toast.info('Copied to clipboard')
                  }}
                >
                  <Copy size={16} />
                </Button>
              </Box>
            </Box>
            <Box column gap1>
              <Box gray500 textXS>
                Server URL
              </Box>
              {item.url && <Box textBase>{item.url}</Box>}
              {!item.url && (
                <Box textSM gray400>
                  Waiting to deploy
                </Box>
              )}
            </Box>

            <Box column gap1>
              <Box gray500 textXS>
                Region
              </Box>
              {item.region && <Box textBase>{item.region}</Box>}
              {!item.region && (
                <Box textSM gray400>
                  Please config region
                </Box>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
