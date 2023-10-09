import { FC, PropsWithChildren, useEffect } from 'react'
import { Box } from '@fower/react'
import { EditorProvider } from '@penx/editor'
import {
  useCommands,
  useDoc,
  useInitDoc,
  useQuerySpaces,
  useSpaces,
  useWorkers,
} from '@penx/hooks'
import { DocContent } from '../doc/DocContent'
import { CommandPanel } from '../Palette'
import { Sidebar } from '../Sidebar/Sidebar'
import { StatusBar } from '../StatusBar/StatusBar'
import { CommandDrawer } from './CommandDrawer'
import { DrawerSidebar } from './SidebarDrawer'

function WithDoc({ docId, children }: PropsWithChildren<{ docId: string }>) {
  const doc = useDoc()
  useInitDoc(docId)
  useWorkers()

  if (!doc.inited) return null

  return <DocContent />
}

export const EditorLayout: FC<PropsWithChildren> = ({ children }) => {
  useQuerySpaces()
  const { commands } = useCommands()

  const { spaces, activeSpace } = useSpaces()

  if (!spaces?.length) return null

  return (
    <EditorProvider space={activeSpace}>
      <Box
        h-48
        sticky
        top0
        toCenterY
        toBetween
        px2
        display={['inline-flex', 'inline-flex', 'none']}
        w-100p
        bgWhite
        zIndex-10
      >
        <DrawerSidebar />
        <CommandDrawer />
      </Box>

      <CommandPanel />
      <Box h-100vh toLeft black textSM>
        <Box w={[0, 0, 300]} toLeft>
          <Sidebar />
        </Box>
        <Box flex-1 h-100vh relative>
          <Box
            overflowYAuto
            h={['calc(100vh - 48px)', '100vh']}
            relative
            px={[16, 16, 16, 0]}
          >
            <WithDoc docId={activeSpace.activeDocId!}></WithDoc>
          </Box>

          <StatusBar></StatusBar>
        </Box>
      </Box>
    </EditorProvider>
  )
}
