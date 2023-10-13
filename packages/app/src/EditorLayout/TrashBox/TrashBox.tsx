import { useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { useSpaces } from '@penx/hooks'
import { db, IDoc } from '@penx/local-db'

export const TrashBox = () => {
  const [docs, setDocs] = useState<IDoc[]>([])
  const { activeSpace } = useSpaces()
  useEffect(() => {
    db.listTrashedDocs(activeSpace.id).then((docs = []) => {
      setDocs(docs)
    })
  }, [activeSpace])

  return (
    <Box gray600 p3 bgWhite rounded2XL>
      <Box toCenterY toBetween gap2>
        <Box fontBold>Trash</Box>
      </Box>
      <Box column>
        {/* {docs.map((doc) => (
        ))} */}
      </Box>
    </Box>
  )
}
