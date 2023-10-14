import { Box } from '@fower/react'
import { Trans } from '@lingui/macro'
import { Bird } from 'lucide-react'
import { Button } from 'uikit'
import { useDocs } from '@penx/hooks'
import { store } from '@penx/store'
import { AllDocsTable } from './AllDocsTable'

export const AllDocsBox = () => {
  const { docList } = useDocs()

  if (!docList.normalDocs.length)
    return (
      <Box toCenter column h-100p gap3>
        <Box gray400>
          <Bird size={120} strokeWidth="1px" />
        </Box>
        <Box textLG gray800 fontSemibold>
          <Trans>There are no documents here yet.</Trans>
        </Box>
        <Box gray400>
          <Trans>
            Click the 'New Doc' button or press ⌘ + N to create your Doc.
          </Trans>
        </Box>
        <Button
          colorScheme="white"
          roundedFull
          onClick={() => {
            store.createDoc()
          }}
        >
          New Doc
        </Button>
      </Box>
    )

  return (
    <Box px10 py10 bgWhite rounded2XL>
      <Box toCenterY toBetween gap2 mb8>
        <Box fontBold text3XL>
          All Docs
        </Box>
      </Box>
      <Box column gray700>
        <AllDocsTable docs={docList.normalDocs} />
      </Box>
    </Box>
  )
}
