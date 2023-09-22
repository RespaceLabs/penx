import { Box } from '@fower/react'
import { Trans } from '@lingui/macro'
import { Tag } from 'bone-ui'

export const SloganBox = () => {
  return (
    <Box column gapY6>
      <Box fontBold text8XL leadingNone>
        <Box toCenterY gapX2>
          <Box text5XL gray400>
            Collaborative
          </Box>
          <Tag size="lg" colorScheme="gray100" mb--10 fontLight gray500>
            Github based
          </Tag>
        </Box>
        <Box>markdown editor</Box>
        <Box>for Static Site</Box>
      </Box>
      <Box text2XL fontLight gray800 maxW-600 leadingNormal>
        <Trans>
          An elegant way to write, edit, and collaborate on your markdown
          content for Static Site
        </Trans>
      </Box>
    </Box>
  )
}
