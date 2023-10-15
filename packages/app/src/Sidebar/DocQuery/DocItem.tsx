import { memo } from 'react'
import { Box } from '@fower/react'
import { useSidebarDrawer } from '@penx/hooks'
import { Doc } from '@penx/model'
import { DocService } from '@penx/service'
import { DocItemMenu } from './DocItemMenu'

interface Props {
  doc: Doc
}

export const DocItem = memo(
  function DocItem({ doc }: Props) {
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
        <Box inlineFlex onClick={(e) => e.stopPropagation()}>
          <DocItemMenu doc={doc} />
        </Box>
      </Box>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.doc.id === nextProps.doc.id &&
      prevProps.doc.title === nextProps.doc.title
    )
  },
)
