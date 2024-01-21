import { Box } from '@fower/react'
import { useQuery } from '@tanstack/react-query'
import { Pencil } from 'lucide-react'
import { Button, Spinner } from 'uikit'
import { trpc } from '@penx/trpc-client'

export function SyncServerList() {
  const { isLoading, data = [] } = useQuery(['syncServers'], () =>
    trpc.syncServer.all.query(),
  )

  if (isLoading) {
    return (
      <Box toCenter h-60vh>
        <Spinner />
      </Box>
    )
  }

  return (
    <Box mt10>
      <Box column gap1>
        {data?.map((item) => (
          <Box key={item.id} toCenterY gap2>
            <Box textLG>{item.name}</Box>
            <Box gray500 textSM>
              {item.token}
            </Box>

            <Button isSquare size={28} variant="light">
              <Pencil size={16}></Pencil>
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
