import { Box } from '@fower/react'
import { useDocs } from '@penx/hooks'
import { TrashTable } from './TrashTable'

export const TrashBox = () => {
  const { docList } = useDocs()

  return (
    <Box px10 py10 bgWhite rounded2XL>
      <Box toCenterY toBetween gap2 mb8>
        <Box fontBold text3XL>
          Trash
        </Box>
      </Box>
      <Box column gray700>
        <TrashTable docs={docList.trashedDocs} />
      </Box>
    </Box>
  )
}
