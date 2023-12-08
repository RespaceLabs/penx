import { Box } from '@fower/react'
import { ExportBtn } from '../components/ExportBtn'

export const ExportToJSON = () => {
  return (
    <Box column gap2>
      <Box textLG fontMedium>
        Export entire space
      </Box>

      <Box gray600 leadingNormal textSM>
        Export entire space to backup you data.
      </Box>

      <Box>
        <ExportBtn />
      </Box>
    </Box>
  )
}
