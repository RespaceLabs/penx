import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { Box, css, styled } from '@fower/react'
import { Node as SlateNode } from 'slate'
import { Divider, modalController } from 'uikit'
import { Command } from '@penx/cmdk'
import { ModalNames } from '@penx/constants'
import { DatabaseProvider } from '@penx/database-context'
import { RowForm } from '@penx/database-ui'
import { usePaletteDrawer } from '@penx/hooks'
import { Node } from '@penx/model'
import { ICellNode, IRowNode } from '@penx/model-types'
import { mappedByKey } from '@penx/shared'
import { store } from '@penx/store'
import { useValue } from './hooks/useValue'

const CommandItem = styled(Command.Item)

interface Props {
  q: string
  setSearch: Dispatch<SetStateAction<string>>
  close: () => void
  afterSearch?: () => void
}

interface Item {
  database: Node
  cell: ICellNode
  refNode?: Node | null
  rowCells: ICellNode[]
}

export function SearchByCell({ q, setSearch, afterSearch, close }: Props) {
  const postfix = q.replace(/^#(\s+)?/, '') || ''
  const regex = /^(\S+)\s?(.*)?$/
  const [_, tag, text = ''] = postfix.match(regex) || []

  const { value } = useValue()

  const paletteDrawer = usePaletteDrawer()

  const filteredItems: Item[] = useMemo(() => {
    const database = store.node.getDatabaseByName(tag)!

    if (!database) return []

    const { columns, views, cells } = store.node.getDatabase(database.id)

    const columnMap = mappedByKey(columns, 'id')
    const currentView = views[0]
    const { viewColumns = [] } = currentView.props
    const sortedColumns = viewColumns.map(({ columnId }) => columnMap[columnId])

    const items = cells
      .filter((cell) => {
        // first try to match the ref
        const ref = store.node.getNode(cell.props.ref!)

        if (!ref) {
          const { data = '' } = cell.props

          // try to match others cell data
          if (data) {
            return String(data).toLowerCase().includes(text.toLowerCase())
          }

          return false
        }

        if (!text) return true

        const str = SlateNode.string(new Node(ref).element[0])
        const matched = str.toLowerCase().includes(text.toLowerCase())

        return matched
      })
      .map((cell) => {
        const raw = store.node.getNode(cell.props.ref!) || cell
        const node = new Node(raw)
        const rowId = cell.props.rowId

        const rowCells = sortedColumns.map((column) => {
          return cells.find(
            (cell) =>
              cell.props.rowId === rowId && cell.props.columnId === column.id,
          )!
        })

        return {
          cell,
          refNode: node,
          database: new Node(database),
          rowCells: rowCells,
        } as Item
      })

    return items
  }, [tag, text])

  if (!filteredItems.length) {
    return (
      <Box textSM toCenter h-64>
        No results found.
      </Box>
    )
  }

  const currentItem = filteredItems.find((item) => item.cell.id === value)

  return (
    <Box toLeft overflowHidden absolute top-48 bottom-48 left0 right0>
      <Command.Group
        className={css({
          overflowAuto: true,
          py: 8,
          px: 8,
        })}
      >
        {filteredItems
          .slice(0, 20)
          .map(({ database, rowCells, cell }, index) => {
            const onSelect = () => {
              modalController.open(ModalNames.ROW, {
                cell,
                database,
              })

              paletteDrawer?.close()
              close()
              setSearch('')
            }

            return (
              <CommandItem
                key={index}
                cursorPointer
                column
                px2
                py2
                roundedLG
                value={cell.id}
                onSelect={() => {
                  onSelect()
                }}
                onClick={() => {
                  onSelect()
                }}
              >
                <Box toCenterY gap1>
                  <Box>{`#${database.tagName}`}</Box>
                  <Box>{String(cell.props.data)}</Box>
                </Box>
              </CommandItem>
            )
          })}
      </Command.Group>
      <Divider orientation="vertical" />
      <Box className="search-by-cell-right" w-50p overflowAuto p3>
        {currentItem && (
          <DatabaseProvider databaseId={currentItem.database.id}>
            <RowForm
              databaseId={currentItem.database.id}
              rowId={currentItem.cell.props.rowId}
            />
          </DatabaseProvider>
        )}
      </Box>
    </Box>
  )
}
