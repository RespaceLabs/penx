import { Box } from '@fower/react'
import { Card, Input } from 'uikit'
import { useSpaces } from '@penx/hooks'
import { db } from '@penx/local-db'
import { store } from '@penx/store'

export const SyncServerSelect = () => {
  const { activeSpace } = useSpaces()

  return (
    <Box column gap2 maxW-600>
      <Box textLG fontMedium>
        Choose Sync Server
      </Box>
      <Box gray600 leadingNormal textSM>
        Choose a sync server to sync your space data.
      </Box>
      <Box>
        <Input
          placeholder="Space name"
          value={activeSpace.name}
          onChange={async (e) => {
            await db.updateSpace(activeSpace.id, {
              name: e.target.value,
            })
            const spaces = await db.listSpaces()
            store.space.setSpaces(spaces)
          }}
        />
      </Box>
    </Box>
  )
}
