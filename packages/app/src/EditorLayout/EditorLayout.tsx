import { FC, PropsWithChildren, useEffect } from 'react'
import { Box } from '@fower/react'
import { EditorProvider } from '@penx/editor'
import {
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
import { MobileNav } from './MobileNav'
import { PCNav } from './PCNav'

function WithDoc({ docId, children }: PropsWithChildren<{ docId: string }>) {
  const doc = useDoc()
  useInitDoc(docId)
  useWorkers()

  if (!doc.inited) return null

  return <>{children}</>
}

export const EditorLayout: FC<PropsWithChildren> = ({ children }) => {
  useQuerySpaces()
  const { spaces, activeSpace } = useSpaces()

  if (!spaces?.length) return null

  return (
    <EditorProvider space={activeSpace}>
      <CommandPanel />
      <Box h-100vh toLeft black textSM overflowHidden>
        <Box w={[0, 0, 300]} toLeft>
          <Sidebar />
        </Box>
        <Box flex-1 h-100vh relative>
          <MobileNav />
          <PCNav />
          <Box
            overflowYAuto
            h={['calc(100vh - 48px)', '100vh']}
            px={[16, 16, 16, 0]}
            py0
          >
            <WithDoc docId={activeSpace.activeDocId!}>
              <DocContent />
            </WithDoc>
          </Box>

          <StatusBar></StatusBar>
        </Box>
      </Box>
    </EditorProvider>
  )
}
