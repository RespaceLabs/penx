import { Box } from '@fower/react'
import { ReadonlyDatabase } from '@penx/database-ui'
import { IDatabaseNode } from '@penx/model-types'

interface Props {
  database: IDatabaseNode
}

export const TagHubContent = ({ database }: Props) => {
  return (
    <Box px12 py8 flex-1>
      <ReadonlyDatabase node={database} />
    </Box>
  )
}
