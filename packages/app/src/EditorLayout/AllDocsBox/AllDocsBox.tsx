import { Box } from '@fower/react'
import { Trans } from '@lingui/macro'
import { Bird } from 'lucide-react'
import { Button } from 'uikit'
import { useNodes } from '@penx/hooks'
import { store } from '@penx/store'
import { AllDocsTable } from './AllDocsTable'

export const AllDocsBox = () => {
  const { nodeList } = useNodes()

  if (!nodeList.rootNodes) {
    return (
      <Box toCenter column h-100p gap3>
        <Box gray400>
          <Bird size={120} strokeWidth="1px" />
        </Box>
        <Box textLG gray800 fontSemibold>
          <Trans>There are no Nodes here yet.</Trans>
        </Box>
        <Box gray400>
          <Trans>Click the 'New Node' button to create your Node.</Trans>
        </Box>
        <Button
          colorScheme="white"
          roundedFull
          onClick={() => {
            store.createPageNode()
          }}
        >
          New Node
        </Button>
      </Box>
    )
  }

  return (
    <Box px10 py10 bgWhite rounded2XL>
      <Box toCenterY toBetween gap2 mb8>
        <Box fontBold text3XL>
          All Nodes
        </Box>
      </Box>
      <Box column gray700>
        <AllDocsTable nodes={nodeList.rootNodes} />
      </Box>
    </Box>
  )
}
