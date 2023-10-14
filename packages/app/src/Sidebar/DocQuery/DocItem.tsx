import { Box } from '@fower/react'
import { Doc, DocService } from '@penx/domain'
import { useSidebarDrawer } from '@penx/hooks'
import { DocItemMenu } from './DocItemMenu'

interface Props {
  doc: Doc
}

export const DocItem = ({ doc }: Props) => {
  const { close } = useSidebarDrawer()
  return (
    <Box
      className="docItem"
      toCenterY
      gap2
      gray500
      textSM
      py2
      px1
      bgGray100--hover
      cursorPointer
      rounded
      onClick={() => {
        const docService = new DocService(doc)
        docService.selectDoc()
        close?.()
      }}
    >
      <Box flex-1>{doc.title || 'Untitled'}</Box>
      <DocItemMenu doc={doc} />
    </Box>
  )
}
