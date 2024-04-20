import { Button, useModalContext } from 'uikit'
import { db } from '@penx/local-db'
import {
  ICellNode,
  IColumnNode,
  IDatabaseNode,
  IOptionNode,
  IRowNode,
  IViewNode,
  ViewType,
} from '@penx/model-types'
import { getActiveSpaceId } from '@penx/storage'
import { store } from '@penx/store'

interface DatabaseProps {
  database: IDatabaseNode
  views: IViewNode[]
  columns: IColumnNode[]
  rows: IRowNode[]
  cells: ICellNode[]
  options: IOptionNode[]
}

export const UseThisTagButton = ({
  database,
  columns,
  views,
  rows,
}: DatabaseProps) => {
  const { close } = useModalContext()
  return (
    <Button
      colorScheme="black"
      onClick={async () => {
        const name = database.props.name.replace('$template__', '')
        const spaceId = await getActiveSpaceId()
        const findDatabase = await db.getDatabaseByName(spaceId, name)

        if (findDatabase) {
          store.node.selectNode(findDatabase)
          close()
          return
        }

        const tableView = views.find(
          (item) => item.props.viewType === ViewType.TABLE,
        )!

        const columnSchema = tableView.props.viewColumns.map((item) => {
          const column = columns.find((c) => c.id === item.columnId)!
          return {
            ...column.props,
            optionIds: [],
          }
        })

        const newDatabase = await db.createDatabase({
          spaceId,
          name,
          columnSchema,
          shouldInitCells: true,
        })

        const nodes = await db.listNodesBySpaceId(spaceId)

        store.node.setNodes(nodes)
        store.node.selectNode(newDatabase)
        close()
      }}
    >
      Use this tag
    </Button>
  )
}
