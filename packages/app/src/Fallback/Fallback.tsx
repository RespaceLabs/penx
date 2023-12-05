import { Box } from '@fower/react'
import { ExportBtn } from './ExportBtn'

export const Fallback = () => {
  return (
    <Box h-100vh toCenter column gap4>
      <Box textLG gray600>
        ⚠️Something went wrong
      </Box>
      <ExportBtn />
    </Box>
  )
}
