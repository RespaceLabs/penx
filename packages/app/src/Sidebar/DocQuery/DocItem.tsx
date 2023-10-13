import { Box } from '@fower/react'
import { Doc, DocService } from '@penx/domain'
import { IDoc } from '@penx/local-db'
import { DocItemMenu } from './DocItemMenu'

interface Props {
  doc: Doc
}

export const DocItem = ({ doc }: Props) => {
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
        const docService = new DocService(doc.raw)
        docService.selectDoc()
      }}
    >
      <Box flex-1>{doc.title}</Box>
      <DocItemMenu doc={doc} />
    </Box>
  )
}
