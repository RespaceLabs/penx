import { Box } from '@fower/react'
import { Button } from 'uikit'
import { DeleteSpaceModal } from '../Workbench/SpaceSettings/DeleteSpaceModal'
import { ExportBtn } from './ExportBtn'
import { ReloadAppBtn } from './ReloadAppBtn'

export const Fallback = () => {
  return (
    <Box h-100vh toCenter column gap4>
      <Box textLG gray600>
        ⚠️Something went wrong
      </Box>
      <ExportBtn />
      <ReloadAppBtn />
      <DeleteSpaceModal>
        <Button>Delete space</Button>
      </DeleteSpaceModal>
    </Box>
  )
}
