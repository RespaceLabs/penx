import { useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { Doc } from '@penx/domain'
import { useSpaces } from '@penx/hooks'
import { db } from '@penx/local-db'
import { TrashTable } from './TrashTable'

export const TrashBox = () => {
  const [docs, setDocs] = useState<Doc[]>([])
  const { activeSpace } = useSpaces()
  useEffect(() => {
    db.listTrashedDocs(activeSpace.id).then((docs = []) => {
      setDocs(docs.map((doc) => new Doc(doc)))
    })
  }, [activeSpace])

  return (
    <Box px10 py10 bgWhite rounded2XL>
      <Box toCenterY toBetween gap2 mb8>
        <Box fontBold text3XL>
          Trash
        </Box>
      </Box>
      <Box column gray700>
        <TrashTable docs={docs} />
      </Box>
    </Box>
  )
}
