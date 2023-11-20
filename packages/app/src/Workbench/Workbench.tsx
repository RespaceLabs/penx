import { isMobile } from 'react-device-detect'
import { Box } from '@fower/react'
import { useAtomValue } from 'jotai'
import { EditorProvider } from '@penx/editor'
import { useQuerySpaces, useSpaces } from '@penx/hooks'
import { routerAtom } from '@penx/store'
import { CommandPanel } from '../Palette'
import { Sidebar } from '../Sidebar/Sidebar'
import { MobileNav } from './DocNav/MobileNav'
import { PCNav } from './DocNav/PCNav'
import { NodeContent } from './NodeContent'
import { QueryNodes } from './QueryNodes'
import { StatusBar } from './StatusBar/StatusBar'
import { SyncBox } from './SyncBox/SyncBox'

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
      <QueryNodes spaceId={activeSpace.id} />
      {!isMobile && <CommandPanel />}

      <Box h-100vh toLeft black textSM overflowHidden>
        <Box w={[0, 0, SIDEBAR_WIDTH]} toLeft>
          <Sidebar />
        </Box>
        <Box flex-1 h-100vh relative>
          <MobileNav />

          {name === 'NODE' && <PCNav />}

          <Box
            overflowYAuto
            h={['calc(100vh - 48px)', '100vh']}
            px={[10, 16, 30, 40, 0]}
            py0
          >
            {name === 'SYNC' && <SyncBox />}
            {name === 'NODE' && <NodeContent />}
          </Box>

          <StatusBar></StatusBar>
        </Box>
      </Box>
    </EditorProvider>
  )
}
