import { FC, PropsWithChildren } from 'react'
import { Box } from '@fower/react'
import { useAtomValue } from 'jotai'
import { EditorProvider } from '@penx/editor'
import {
  useDoc,
  useQueryDoc,
  useQuerySpaces,
  useSpaces,
  useWorkers,
} from '@penx/hooks'
import { routerAtom } from '@penx/store'
import { DocContent } from '../doc/DocContent'
import { CommandPanel } from '../Palette'
import { Sidebar } from '../Sidebar/Sidebar'
import { StatusBar } from '../StatusBar/StatusBar'
import { AllDocsBox } from './AllDocsBox/AllDocsBox'
import { MobileNav } from './DocNav/MobileNav'
import { PCNav } from './DocNav/PCNav'
import { QueryDocs } from './QueryDocs'
import { TrashBox } from './TrashBox/TrashBox'

function WithDoc({ docId, children }: PropsWithChildren<{ docId: string }>) {
  const { inited } = useQueryDoc(docId)
  useWorkers()

  if (!inited) return null

  return <>{children}</>
}

export const EditorLayout: FC<PropsWithChildren> = ({ children }) => {
  useQuerySpaces()
  const { spaces, activeSpace } = useSpaces()
  const { name } = useAtomValue(routerAtom)

  if (!spaces?.length) return null

  return (
    <EditorProvider space={activeSpace}>
      <QueryDocs spaceId={activeSpace.id} />
      <CommandPanel />
      <Box h-100vh toLeft black textSM overflowHidden>
        <Box w={[0, 0, 300]} toLeft>
          <Sidebar />
        </Box>
        <Box flex-1 h-100vh relative>
          {name === 'DOC' && (
            <>
              <MobileNav />
              <PCNav />
            </>
          )}
          <Box
            overflowYAuto
            h={['calc(100vh - 48px)', '100vh']}
            px={[16, 16, 16, 0]}
            py0
          >
            {name === 'TRASH' && <TrashBox />}
            {name === 'ALL_DOCS' && <AllDocsBox />}
            {name === 'DOC' && (
              <WithDoc docId={activeSpace.activeDocId!}>
                <DocContent />
              </WithDoc>
            )}
          </Box>

          <StatusBar></StatusBar>
        </Box>
      </Box>
    </EditorProvider>
  )
}
