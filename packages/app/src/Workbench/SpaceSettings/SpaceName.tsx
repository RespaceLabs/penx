import { Box } from '@fower/react'
import { Input } from 'uikit'
import { useActiveSpace } from '@penx/hooks'
import { db } from '@penx/local-db'
import { Space } from '@penx/model'
import { store } from '@penx/store'

interface Props {
  space: Space
}

export const SpaceName = ({ space }: Props) => {
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
          value={space.name}
          onChange={async (e) => {
            await db.updateSpace(space.id, {
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
