import { Box } from '@fower/react'
import { DataEditor } from '@glideapps/glide-data-grid'
import { useQuery } from '@tanstack/react-query'
import { Button } from 'uikit'
import { db } from '@penx/local-db'
import {
  ICellNode,
  IColumnNode,
  IDatabaseNode,
  IOptionNode,
  IRowNode,
  IViewNode,
} from '@penx/model-types'
import { cellRenderers } from '../views/TableView/cells'
import { useReadonlyTableView } from './useReadonlyTableView'
import { UseThisTagButton } from './UseThisTagButton'

interface Props {
  node: IDatabaseNode
}

export const ReadonlyDatabase = ({ node }: Props) => {
  const { isLoading, data } = useQuery({
    queryKey: [node.id],
    queryFn: () => {
      return db.getDatabase(node.id)
    },
  })

  if (isLoading || !data) return

  return (
    <Box column gap3>
      <Box toCenterY toBetween>
        <Box toCenterY gap2>
          <Box
            textXL
            circle6
            fontSemibold
            color={data.database.props.color || 'neutral500'}
            bg--T80={data.database.props.color || 'neutral500'}
            toCenter
          >
            #
          </Box>
          <Box fontSemibold text4XL>
            {data?.database.props.name.replace('$template__', '')}
          </Box>
        </Box>
        <UseThisTagButton {...data!} />
      </Box>
      <TableView {...data!} />
    </Box>
  )
}

interface DatabaseProps {
  database: IDatabaseNode
  views: IViewNode[]
  columns: IColumnNode[]
  rows: IRowNode[]
  cells: ICellNode[]
  options: IOptionNode[]
}

function TableView(props: DatabaseProps) {
  const { rows } = props
  const { cols, getContent } = useReadonlyTableView(props)
  const rowsHeight = (rows.length + 1) * 34 + 2
  const height = rowsHeight > 630 ? 630 : rowsHeight
  // console.log('h-------h:', h)

  return (
    <Box flex-1 borderTop borderBottom h-100p flex>
      <DataEditor
        // className={css('borderBottom borderTop')}
        columns={cols}
        rows={props.rows.length}
        theme={{
          bgHeader: 'white',
          textHeader: '#888',
          borderColor: '#e9e9e9',
        }}
        smoothScrollX
        smoothScrollY
        height={height}
        width={'100%'}
        rowMarkers="number"
        getCellsForSelection={true}
        onPaste
        customRenderers={cellRenderers}
        getCellContent={getContent}
      />
    </Box>
  )
}
