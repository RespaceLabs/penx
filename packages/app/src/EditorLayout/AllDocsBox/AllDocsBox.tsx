import { Box } from '@fower/react'
import { useDocs } from '@penx/hooks'
import { AllDocsTable } from './AllDocsTable'

export const AllDocsBox = () => {
  const { docList } = useDocs()

  return (
    <Box px10 py10 bgWhite rounded2XL>
      <Box toCenterY toBetween gap2 mb8>
        <Box fontBold text3XL>
          All Docs
        </Box>
      </Box>
      <Box column gray700>
        <AllDocsTable docs={docList.docs} />
      </Box>
    </Box>
  )
}
