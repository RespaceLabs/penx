import { useState } from 'react'
import { Box } from '@fower/react'
import {
  Button,
  Card,
  Input,
  Select,
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
  Tag,
  toast,
} from 'uikit'
import { useActiveSpace } from '@penx/hooks'
import { db } from '@penx/local-db'
import { api, trpc } from '@penx/trpc-client'

export const SyncServerSelect = () => {
  const { activeSpace } = useActiveSpace()
  const [serverId, setServerId] = useState(activeSpace.syncServerId)
  const { data = [], isLoading } = trpc.syncServer.runningSyncServers.useQuery()
  const [loading, setLoading] = useState(false)

  async function submit() {
    setLoading(true)
    const syncServer = data.find((item) => item.id === serverId)!
    try {
      const accessToken = await api.syncServer.accessToken.query({
        syncServerId: syncServer.id,
      })

      await api.space.updateSyncServer.mutate({
        spaceId: activeSpace.id,
        syncServerId: syncServer.id,
      })

      await db.updateSpace(activeSpace.id, {
        syncServerId: syncServer.id,
        syncServerUrl: syncServer.url as string,
        syncServerAccessToken: accessToken,
      })
      toast.success('Sync server has been updated')
    } catch (error) {
      toast.error('Failed to update sync server')
    }
    setLoading(false)
  }

  return (
    <Card column gap2 maxW-600>
      <Box textLG fontMedium>
        Choose Sync Server
      </Box>
      <Box gray600 leadingNormal textSM>
        Choose a sync server to sync your space data.
      </Box>
      <Box>
        <Select
          value={serverId}
          onChange={(v: string) => {
            setServerId(v)
          }}
        >
          <SelectTrigger bgSlate100 flex-1>
            <SelectValue placeholder="Select a sync server" gap4 />
            <SelectIcon></SelectIcon>
          </SelectTrigger>
          <SelectContent w-200>
            {data.map((item) => (
              <SelectItem key={item.id} value={item.id} gap4>
                <Box>{item.name}</Box>
                <Tag>{item.region}</Tag>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Box>
      <Box mt4>
        <Button
          colorScheme="black"
          disabled={loading || isLoading}
          onClick={submit}
          gap2
        >
          {loading && <Spinner white square4 />}
          <Box>Save sync server</Box>
        </Button>
      </Box>
    </Card>
  )
}
