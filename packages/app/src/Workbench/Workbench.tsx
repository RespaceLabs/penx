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
import { SyncServer } from '../SyncServer/SyncServer'
import { TaskBoard } from '../TaskBoard'
import { AccountSettings } from './AccountSettings/AccountSettings'
import { MobileNav } from './NodeNav/MobileNav'
import { NodePanels } from './NodePanels'
import { PageTodo } from './PageTodo/PageTodo'
import { QueryCloudSpaces } from './QueryCloudSpaces'
import { Sidebar } from './Sidebar/Sidebar'
import { SpaceSettings } from './SpaceSettings/SpaceSettings'
import { VersionControl } from './VersionControl/VersionControl'
import { Web3Profile } from './Web3Profile/Web3Profile'

export const Workbench = () => {
  const { activeSpace } = useSpaces()
  const { name } = useAtomValue(routerAtom)
  const { data: session } = useSession()

  const SIDEBAR_WIDTH = 260
  // const SIDEBAR_WIDTH = 600

  // console.log('router name==========:', name)

  if (!activeSpace) return null

  return (
    <EditorProvider space={activeSpace}>
      {session && <QueryCloudSpaces />}

      {!isMobile && <CommandPanel />}
      <Box h-100vh toLeft black flex-1>
        <Box w={[0, 0, SIDEBAR_WIDTH]} toLeft flexShrink-0>
          <Sidebar />
        </Box>
        <Box flex-1 relative>
          <MobileNav />

          <ErrorBoundary fallback={<Fallback />}>
            {name === 'NODE' && <NodePanels />}

            {name !== 'NODE' && (
              <Box h-100vh overflowYAuto>
                {name === 'ACCOUNT_SETTINGS' && <AccountSettings />}
                {name === 'TODOS' && <PageTodo />}
                {name === 'SPACE_SETTINGS' && <SpaceSettings />}
                {name === 'SYNC_SERVER' && <SyncServer />}
                {name === 'WEB3_PROFILE' && <Web3Profile />}
                {name === 'TASK_BOARD' && <TaskBoard />}
                {name === 'VERSION_CONTROL' && <VersionControl />}
              </Box>
            )}
          </ErrorBoundary>
        </Box>
      </Box>
    </EditorProvider>
  )
}
