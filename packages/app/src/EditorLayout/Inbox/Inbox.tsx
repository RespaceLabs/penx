import { Box } from '@fower/react'

export const Inbox = () => {
  return (
    <Box px10 py10 bgWhite rounded2XL>
      <Box toCenterY toBetween gap2 mb8>
        <Box fontBold text3XL>
          Inbox
        </Box>
      </Box>
      <Box column gray700>
        GOGO
      </Box>
    </Box>
  )
}
