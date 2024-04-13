import { useState } from 'react'
import { isMobile } from 'react-device-detect'
import { ErrorBoundary } from 'react-error-boundary'
import { Box } from '@fower/react'
import { SIDEBAR_WIDTH, WORKBENCH_NAV_HEIGHT } from '@penx/constants'
import { EditorProvider } from '@penx/editor'
import { useActiveSpace, useRouterName, useUser } from '@penx/hooks'
import { IconSidebar } from '@penx/icons'
import { useSession } from '@penx/session'
import { Fallback } from '../Fallback/Fallback'
import { LoginByTokenModal } from '../LoginByTokenModal/LoginByTokenModal'
import { CommandPanel } from '../Palette'
import { TaskBoard } from '../TaskBoard'
import { BackupMnemonicTips } from './BackupMnemonicTips'
import { BottomBar } from './BottomBar'
import { MobileNav } from './NodeNav/MobileNav'
import { PCNav } from './NodeNav/PCNav'
import { NodePanels } from './NodePanels'
import { PageTodo } from './PageTodo/PageTodo'
import { SettingsModal } from './SettingsModal/SettingsModal'
import { Sidebar } from './Sidebar/Sidebar'
import { Web3Profile } from './Web3Profile/Web3Profile'

export const Workbench = () => {
  const { activeSpace } = useActiveSpace()
  const name = useRouterName()
  const { data: session } = useSession()
  const [sidebarOpen, setSideBarOpen] = useState(true)
  const handleViewSidebar = () => {
    setSideBarOpen(!sidebarOpen)
  }

  const { user } = useUser()

  // const SIDEBAR_WIDTH = 600

  // console.log('router name==========:', name)

  const isBackedUp = user?.isMnemonicBackedUp

  if (!activeSpace) return null

  return (
    <EditorProvider space={activeSpace}>
      <LoginByTokenModal />
      <SettingsModal />

      <Box h-100vh toLeft black flex-1 relative>
        {!isBackedUp && session && name === 'NODE' && <BackupMnemonicTips />}

        <Box toLeft relative>
          <Box
            w={sidebarOpen ? [0, 0, SIDEBAR_WIDTH] : 0}
            h-100vh
            toLeft
            flexShrink-0
            transition="width 0.3s"
          >
            <Sidebar />
          </Box>
          <Box h={WORKBENCH_NAV_HEIGHT} toCenterY absolute right--40 zIndex-100>
            {!isMobile && <CommandPanel />}
            <Box
              onClick={handleViewSidebar}
              cursorPointer
              neutral500
              ml2
              square6
              toCenter
              rounded
              bgNeutral100--hover
              display={['none', 'none', 'flex']}
            >
              <IconSidebar size={20} fillGray600 />
            </Box>
          </Box>
        </Box>
        <Box flex-1 relative overflowHidden>
          <ErrorBoundary fallback={<Fallback />}>
            {name === 'TODOS' && <BottomBar />}

            {name === 'NODE' && <NodePanels />}

            {name !== 'NODE' && (
              <Box h-100vh overflowYAuto>
                <PCNav />
                <MobileNav />

                {name === 'TODOS' && <PageTodo />}
                {name === 'WEB3_PROFILE' && <Web3Profile />}
                {name === 'TASK_BOARD' && <TaskBoard />}
              </Box>
            )}
          </ErrorBoundary>
        </Box>
      </Box>
    </EditorProvider>
  )
}
