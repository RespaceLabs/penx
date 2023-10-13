import { useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { MoreHorizontal } from 'lucide-react'
import { Button } from 'uikit'
import { DocService } from '@penx/domain'
import { useSpaces } from '@penx/hooks'
import { db, IDoc } from '@penx/local-db'
import { SqlParser } from './SqlParser'

interface Props {
  sql: string
  title: string
}

export const DocQuery = ({ sql, title }: Props) => {
  const [docs, setDocs] = useState<IDoc[]>([])
  const { activeSpace } = useSpaces()
  useEffect(() => {
    const parsed = new SqlParser(sql)

    db[parsed.tableName]
      .select({
        where: { spaceId: activeSpace.id },
        ...parsed.queryParams,
      })
      .then((docs = []) => {
        setDocs(docs)
      })
  }, [sql, activeSpace])

  return (
    <Box gray600 p3 bgWhite rounded2XL>
      <Box toCenterY toBetween gap2>
        <Box fontBold>{title}</Box>
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
                const docService = new DocService(doc)
                docService.selectDoc()
              }}
            >
              <Box flex-1>{doc.title}</Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
