import { Box } from '@fower/react'
import { Button } from 'uikit'
import { isProd } from '@penx/constants'
import { ExportBtn } from '../components/ExportBtn'
import { DeleteSpaceModal } from '../Workbench/DeleteSpaceModal'
import { ReloadAppBtn } from './ReloadAppBtn'

export const Fallback = () => {
  return (
    <Box h-100vh toCenter column gap4>
      <Box textLG gray600>
        ⚠️Something went wrong
      </Box>
      <ReloadAppBtn />
      <ExportBtn />
      {!isProd && (
        <DeleteSpaceModal>
          <Button>Delete space</Button>
        </DeleteSpaceModal>
      )}
    </Box>
  )
}
