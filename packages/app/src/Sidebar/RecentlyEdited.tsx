import { useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { MoreHorizontal } from 'lucide-react'
import { Parser } from 'node-sql-parser'
import { Button } from 'uikit'
import { useCatalogue } from '@penx/hooks'
import { db, IDoc } from '@penx/local-db'
import { CatalogueIconPopover } from './CatalogueIconPopover'

const parser = new Parser()

export const RecentlyEdited = () => {
  const [docs, setDocs] = useState<IDoc[]>([])
  useEffect(() => {
    const ast = parser.astify(
      'SELECT * FROM doc ORDER BY createdAt ASC limit 100',
    )

    db.doc
      .select({
        sortBy: 'updatedAt',
        limit: 4,
      })
      .then((docs = []) => {
        setDocs(docs)
      })
  }, [])

  const catalogue = useCatalogue()
  console.log('docs:', docs)

  return (
    <Box gray600 p3 bgWhite rounded2XL>
      <Box toCenterY toBetween gap2>
        <Box fontBold>Recently Edited</Box>
        <Button
          size="sm"
          variant="ghost"
          colorScheme="gray700"
          isSquare
          roundedFull
        >
          <MoreHorizontal />
        </Button>
      </Box>
      <Box column>
        {docs.map((doc) => {
          const node = catalogue.tree.findNode(doc.id)!

          return (
            <Box
              key={doc.id}
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
                catalogue.selectNode(node)
              }}
            >
              <CatalogueIconPopover node={node} />
              <Box flex-1>{doc.title}</Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
