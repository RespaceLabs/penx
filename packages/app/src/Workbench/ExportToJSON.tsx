import { Box } from '@fower/react'
import { Space } from '@penx/model'
import { ExportBtn } from '../components/ExportBtn'

interface Props {
  space: Space
}

export const ExportToJSON = ({ space }: Props) => {
  return (
    <Box column gap2>
      <Box textLG fontMedium>
        Export entire space
      </Box>

      <Box gray600 leadingNormal textSM>
        Export entire space to backup you data.
      </Box>

      <Box>
        <ExportBtn space={space.raw} />
      </Box>
    </Box>
  )
}
