import { FC, PropsWithChildren } from 'react'
import { Box } from '@fower/react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useAtom } from 'jotai'
import { useSpaces } from '@penx/hooks'
import { db } from '@penx/local-db'
import { countAtom } from '@penx/store'

export const Count: FC<PropsWithChildren> = ({ children }) => {
  const [value, setValue] = useAtom(countAtom)
  const { activeSpace } = useSpaces()
  const count = useLiveQuery(() =>
    db.doc.where('spaceId').equals(activeSpace.id).count(),
  )

  return (
    <Box>
      <Box>{value}</Box>
    </Box>
  )
}
