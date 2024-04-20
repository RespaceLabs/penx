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
import { getActiveSpaceId } from '@penx/storage'

interface DatabaseProps {
  database: IDatabaseNode
  views: IViewNode[]
  columns: IColumnNode[]
  rows: IRowNode[]
  cells: ICellNode[]
  options: IOptionNode[]
}

export const UseThisTagButton = ({ database, columns }: DatabaseProps) => {
  return (
    <Button
      colorScheme="black"
      onClick={async () => {
        const name = database.props.name.replace('$template__', '')
        const spaceId = await getActiveSpaceId()
        const findDatabase = await db.getDatabaseByName(spaceId, name)

        if (findDatabase) {
          // console.log('===========findDatabase:', findDatabase)
          return
        }

        console.log('go.......:', spaceId)
        const newDatabase = await db.createDatabase({
          spaceId,
          name,
          columnSchema: columns
            .sort((a) => (a.props.isPrimary ? 1 : -1))
            .map((column) => column.props),
          shouldInitCells: false,
        })
      }}
    >
      Use this tag
    </Button>
  )
}
