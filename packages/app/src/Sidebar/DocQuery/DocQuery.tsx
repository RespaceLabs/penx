import { Box } from '@fower/react'
import { MoreHorizontal } from 'lucide-react'
import { Button } from 'uikit'
import { useDocs, useSpaces } from '@penx/hooks'
import { DocStatus } from '@penx/types'
import { SqlParser } from '../SqlParser'
import { DocItem } from './DocItem'

interface Props {
  sql: string
  title: string
}

export const DocQuery = ({ sql, title }: Props) => {
  const { docList } = useDocs()
  const { activeSpace } = useSpaces()
  const parsed = new SqlParser(sql)

  const docs = docList.find({
    where: {
      spaceId: activeSpace.id,
      status: DocStatus.NORMAL,
    },
    ...parsed.queryParams,
  })

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
        {docs.map((doc) => (
          <DocItem key={doc.id} doc={doc} />
        ))}
      </Box>
    </Box>
  )
}
