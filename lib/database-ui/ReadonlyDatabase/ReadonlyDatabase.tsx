import { db } from '@/lib/local-db'
import {
  ICellNode,
  IColumnNode,
  IDatabaseNode,
  IOptionNode,
  IRowNode,
  IViewNode,
} from '@/lib/model'
import { cn } from '@/lib/utils'

import { DataEditor } from '@glideapps/glide-data-grid'
import { useQuery } from '@tanstack/react-query'
import { cellRenderers } from '../views/TableView/cells'
import { useReadonlyTableView } from './useReadonlyTableView'

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
    <div className="flex flex-col gap-3">
      <div className="flex items-end justify-between">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'text-xl w-6 h-6 rounded-full font-semibold flex items-center justify-center',
              data.database.props.color || 'text-foreground/50',
              data.database.props.color || 'bg-foreground/20',
            )}
          >
            #
          </div>
          <div className="font-semibold text-4xl">
            {data?.database.props.name.replace('$template__', '')}
          </div>
        </div>
      </div>
      <TableView {...data!} />
    </div>
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
    <div className="felx flex-1 border-t border-b h-full">
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
    </div>
  )
}
