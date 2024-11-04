import { RefObject, useEffect, useRef } from 'react'
import { GoogleDrive } from '@/lib/google-drive'
import { db } from '@/lib/local-db'
import { FieldType, ICellNode, IColumnNode, IRowNode } from '@/lib/model'
import { DataEditorRef } from '@glideapps/glide-data-grid'

type Params = {
  gridRef: RefObject<DataEditorRef>
  columns: IColumnNode[]
  rows: IRowNode[]
  cells: ICellNode[]
  columnsMap: Record<string, IColumnNode>
  rowsMap: Record<string, IRowNode>
}

type FileCellInfo = {
  fileHash: string
  googleDriveFileId: string
  url: string

  col: number
  row: number
}

export function useLoadFiles({
  cells,
  rows,
  gridRef,
  columns,
  columnsMap,
  rowsMap,
}: Params) {
  const cellFileRef = useRef<Record<string, FileCellInfo>>({})

  async function loadCellFile() {
    const t0 = Date.now()
    const fileCells = cells.filter((c) => {
      const column = columnsMap[c.props.columnId]
      return column?.props.fieldType === FieldType.FILE
    })

    gridRef.current?.updateCells(
      Object.keys(cellFileRef.current).map((id) => ({
        cell: [cellFileRef.current[id].col, cellFileRef.current[id].row],
      })),
    )

    const t1 = Date.now()
    console.log('update cells.........', t1 - t0)
  }

  useEffect(() => {
    setTimeout(() => {
      loadCellFile()
    }, 0)
  }, [])

  return { cellFileRef }
}
