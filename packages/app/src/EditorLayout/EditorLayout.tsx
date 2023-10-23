import { FC, PropsWithChildren } from 'react'
import { isMobile } from 'react-device-detect'
import { Box } from '@fower/react'
import { useAtomValue } from 'jotai'
import { EditorProvider } from '@penx/editor'
import { useQuerySpaces, useSpaces } from '@penx/hooks'
import { routerAtom } from '@penx/store'
import { DocContent } from '../doc/DocContent'
import { NodeContent } from '../NodeContent'
import { CommandPanel } from '../Palette'
import { Sidebar } from '../Sidebar/Sidebar'
import { StatusBar } from '../StatusBar/StatusBar'
import { AllDocsBox } from './AllDocsBox/AllDocsBox'
import { MobileNav } from './DocNav/MobileNav'
import { PCNav } from './DocNav/PCNav'
import { QueryDocs } from './QueryDocs'
import { QueryNodes } from './QueryNodes'
import { SyncBox } from './SyncBox/SyncBox'
import { TrashBox } from './TrashBox/TrashBox'

export const EditorLayout: FC<PropsWithChildren> = ({ children }) => {
  useQuerySpaces()
  const { spaces, activeSpace } = useSpaces()
  const { name } = useAtomValue(routerAtom)

  if (!spaces?.length) return null

  console.log('router name==========:', name)

  return (
    <EditorProvider space={activeSpace}>
      <QueryDocs spaceId={activeSpace.id} />
      <QueryNodes spaceId={activeSpace.id} />
      {!isMobile && <CommandPanel />}

      <Box h-100vh toLeft black textSM overflowHidden>
        <Box w={[0, 0, 280]} toLeft>
          <Sidebar />
        </Box>
        <Box flex-1 h-100vh relative>
          <MobileNav />

          {name === 'DOC' && <PCNav />}

          <Box
            overflowYAuto
            h={['calc(100vh - 48px)', '100vh']}
            px={[10, 16, 30, 40, 0]}
            py0
          >
            {name === 'TRASH' && <TrashBox />}
            {name === 'ALL_DOCS' && <AllDocsBox />}
            {name === 'DOC' && <DocContent />}
            {name === 'SYNC' && <SyncBox />}
            {name === 'NODE' && <NodeContent />}
          </Box>

          <StatusBar></StatusBar>
        </Box>
      </Box>
    </EditorProvider>
  )
}
