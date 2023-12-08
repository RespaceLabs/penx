import { isMobile } from 'react-device-detect'
import { Box } from '@fower/react'
import { useAtomValue } from 'jotai'
import { EditorProvider } from '@penx/editor'
import { useSession, useSpaces } from '@penx/hooks'
import { routerAtom } from '@penx/store'
import { CommandPanel } from '../Palette'
import { AccountSettings } from './AccountSettings/AccountSettings'
import { NodePanels } from './NodePanels'
import { QueryCloudSpaces } from './QueryCloudSpaces'
import { SetPassword } from './SetPassword'
import { Sidebar } from './Sidebar/Sidebar'
import { SpaceSettings } from './SpaceSettings/SpaceSettings'

export const Workbench = () => {
  const session = useSession()
  const { activeSpace } = useSpaces()
  const { name } = useAtomValue(routerAtom)

  const SIDEBAR_WIDTH = 260
  // const SIDEBAR_WIDTH = 600

  console.log('router name==========:', name)

  return (
    <EditorProvider space={activeSpace}>
      {/* {session && <QueryCloudSpaces />} */}

      {!isMobile && <CommandPanel />}
      <Box h-100vh toLeft black textSM flex-1 borderRight>
        <Box w={[0, 0, SIDEBAR_WIDTH]} toLeft>
          <Sidebar />
        </Box>
        <Box flex-1>
          {/* {name === 'ACCOUNT_SETTINGS' && <AccountSettings />} */}
          {/* {name === 'SPACE_SETTINGS' && <SpaceSettings />} */}
          {name === 'NODE' && <NodePanels />}
          {/* {name === 'SET_PASSWORD' && <SetPassword />} */}
        </Box>
      </Box>
    </EditorProvider>
  )
}
