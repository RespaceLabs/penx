import { Box } from '@fower/react'
import { Input } from 'uikit'
import { useSpaces } from '@penx/hooks'
import { db } from '@penx/local-db'
import { store } from '@penx/store'

export const SpaceName = () => {
  const { activeSpace } = useSpaces()

  return (
    <Box column gap2 maxW-600>
      <Box textLG fontMedium>
        Space Name
      </Box>
      <Box gray600 leadingNormal textSM>
        The name for the space, Keep it simple.
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
