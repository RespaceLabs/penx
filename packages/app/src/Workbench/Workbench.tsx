import { isMobile } from 'react-device-detect'
import { Box } from '@fower/react'
import { useAtomValue } from 'jotai'
import { EditorProvider } from '@penx/editor'
import { useQuerySpaces, useSpaces } from '@penx/hooks'
import { routerAtom } from '@penx/store'
import { CommandPanel } from '../Palette'
import { NodePanels } from './NodePanels'
import { Sidebar } from './Sidebar/Sidebar'
import { SyncBox } from './SyncBox/SyncBox'
import { WithNodes } from './WithNodes'

export const Workbench = () => {
  useQuerySpaces()
  const { spaces, activeSpace } = useSpaces()
  const { name } = useAtomValue(routerAtom)
  const SIDEBAR_WIDTH = 260
  // const SIDEBAR_WIDTH = 600

  if (!spaces?.length || !activeSpace.id) return null

  // console.log('router name==========:', name)

  return (
    <EditorProvider space={activeSpace}>
      {!isMobile && <CommandPanel />}
      <WithNodes spaceId={activeSpace.id}>
        <Box h-100vh toLeft black textSM flex-1 borderRight>
          <Box w={[0, 0, SIDEBAR_WIDTH]} toLeft>
            <Sidebar />
          </Box>
          <Box flex-1>
            {name === 'SYNC' && <SyncBox />}
            {name === 'NODE' && <NodePanels />}
          </Box>
        </Box>
      </WithNodes>
    </EditorProvider>
  )
}
