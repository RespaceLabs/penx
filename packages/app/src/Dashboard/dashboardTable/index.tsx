import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Box } from '@fower/react'
import DataEditor, {
  DataEditorProps,
  DataEditorRef,
  EditableGridCell,
  GridCell,
  GridCellKind,
  Item,
} from '@glideapps/glide-data-grid'
import { INode } from '@penx/model-types'

export const defaultProps: Partial<DataEditorProps> = {
  smoothScrollX: true,
  smoothScrollY: true,
  getCellsForSelection: true,
  width: '100%',
  height: '100%',
}

export interface IDashboardTable {
  spaceNodes: INode[]
}

interface IColumns {
  title: string
  id: string
  hasMenu?: boolean
  dataType?: 'Bubble' | 'Image' | 'DatePicker' | 'Number' | 'SingleDropdown'
}

export function DashboardTable({ spaceNodes }: IDashboardTable) {
  const [numRows, setNumRows] = React.useState<number>(0)
  const [columns, setColumns] = useState<IColumns[]>([])

  const ref = React.useRef<DataEditorRef>(null)

  const getContent = useCallback(
    (cell: Item): GridCell => {
      try {
        const [col, row] = cell
        const rowData = spaceNodes[row]
        const colData = columns[col]
        const target = rowData[colData.id as keyof INode]

        if (Array.isArray(target)) {
          const data = JSON.stringify(target)
          return {
            kind: GridCellKind.Text,
            allowOverlay: true,
            readonly: false,
            displayData: data,
            data: data,
          }
        } else if (typeof target === 'object') {
          const data = JSON.stringify(target)
          return {
            kind: GridCellKind.Text,
            allowOverlay: true,
            readonly: false,
            displayData: data,
            data: data,
          }
        } else {
          return {
            kind: GridCellKind.Text,
            allowOverlay: true,
            readonly: false,
            displayData: target ? target.toString() : '',
            data: target ? target.toString() : '',
          }
        }
      } catch (error) {
        return {
          kind: GridCellKind.Text,
          allowOverlay: true,
          readonly: false,
          displayData: 'render row failed',
          data: error ? error.toString() : 'error msg',
        }
      }
    },
    [columns],
  )

  const generateColumns = useCallback((sNodes: INode[]) => {
    if (sNodes.length) {
      const columns = []
      const spaceNode = sNodes[0]
      for (const key in spaceNode) {
        if (spaceNode.hasOwnProperty(key)) {
          const column = {
            title: key,
            id: key,
            hasMenu: false,
          }

          columns.push(column)
        }
      }

      setColumns(columns)
    }
  }, [])

  const onCellEdited = useCallback(
    (cell: Item, newValue: EditableGridCell) => {
      if (newValue.kind !== GridCellKind.Text) {
        // we only have text cells, might as well just die here.
        return
      }
      // not support edite yet
      return
    },
    [columns],
  )

  useEffect(() => {
    generateColumns(spaceNodes)
    setNumRows(spaceNodes.length)
  }, [spaceNodes])

  return (
    <Box h="100%">
      <DataEditor
        {...defaultProps}
        ref={ref}
        columns={columns}
        getCellContent={getContent}
        onCellEdited={onCellEdited}
        rowMarkers={'both'}
        rows={numRows}
      />
    </Box>
  )
}
