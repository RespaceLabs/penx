import { isMobile } from 'react-device-detect'
import { ErrorBoundary } from 'react-error-boundary'
import { Box } from '@fower/react'
import { useAtomValue } from 'jotai'
import { EditorProvider } from '@penx/editor'
import { useSpaces } from '@penx/hooks'
import { useSession } from '@penx/session'
import { routerAtom } from '@penx/store'
import { Fallback } from '../Fallback/Fallback'
import { CommandPanel } from '../Palette'
import { AccountSettings } from './AccountSettings/AccountSettings'
import { MobileNav } from './DocNav/MobileNav'
import { NodePanels } from './NodePanels'
import { QueryCloudSpaces } from './QueryCloudSpaces'
import { SetPassword } from './SetPassword'
import { Sidebar } from './Sidebar/Sidebar'
import { SpaceSettings } from './SpaceSettings/SpaceSettings'

export const Workbench = () => {
  const { activeSpace } = useSpaces()
  const { name } = useAtomValue(routerAtom)

  const SIDEBAR_WIDTH = 260
  // const SIDEBAR_WIDTH = 600

  // console.log('router name==========:', name)

  if (!activeSpace) return null

  return (
    <EditorProvider space={activeSpace}>
      {/* {session && <QueryCloudSpaces />} */}

      {!isMobile && <CommandPanel />}
      <Box h-100vh toLeft black flex-1>
        <Box w={[0, 0, SIDEBAR_WIDTH]} toLeft flexShrink-0>
          <Sidebar />
        </Box>
        <Box flex-1>
          <MobileNav />

          {name === 'ACCOUNT_SETTINGS' && <AccountSettings />}
          {name === 'SPACE_SETTINGS' && <SpaceSettings />}

          <ErrorBoundary fallback={<Fallback />}>
            {name === 'NODE' && <NodePanels />}
          </ErrorBoundary>

          {name === 'SET_PASSWORD' && <SetPassword />}
        </Box>
      </Box>
    </EditorProvider>
  )
}
