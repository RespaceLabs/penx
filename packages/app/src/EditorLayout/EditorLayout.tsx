import { FC, PropsWithChildren } from 'react'
import { Box } from '@fower/react'
import { EditorProvider } from '@penx/editor'
import { useDoc, useInitDoc, useQuerySpaces, useSpaces } from '@penx/hooks'
import { ActivityBar } from '../ActivityBar/ActivityBar'
import { DocContent } from '../doc/DocContent'
import { CommandPanel } from '../Palette'
import { Sidebar } from '../Sidebar/Sidebar'
import { StatusBar } from '../StatusBar/StatusBar'

function WidthDoc({ docId, children }: PropsWithChildren<{ docId: string }>) {
  const doc = useDoc()
  useInitDoc(docId)

  if (!doc.inited) return null

  return <DocContent />
}

export const EditorLayout: FC<PropsWithChildren> = ({ children }) => {
  useQuerySpaces()
  const { spaces, activeSpace } = useSpaces()

  if (!spaces?.length) return null

  return (
    <EditorProvider space={activeSpace}>
      <CommandPanel />
      <Box h-100vh toLeft black textSM>
        <Box w-320 toLeft b>
          <ActivityBar />
          <Sidebar />
        </Box>
        <Box flex-1 h-100vh relative>
          <Box overflowYAuto h={'calc(100vh - 24px)'} relative>
            <WidthDoc docId={activeSpace.activeDocId!}></WidthDoc>
          </Box>

          <StatusBar></StatusBar>
        </Box>
      </Box>
    </EditorProvider>
  )
}
