import { RefObject, useEffect, useRef } from 'react'
import { DataEditorRef } from '@glideapps/glide-data-grid'
import { GoogleDrive } from '@penx/google-drive'
import { db } from '@penx/local-db'
import { FieldType, ICellNode, IColumnNode, IRowNode } from '@penx/model-types'
import { getAuthorizedUser } from '@penx/storage'

type Params = {
  gridRef: RefObject<DataEditorRef>
  columns: IColumnNode[]
  rows: IRowNode[]
  cells: ICellNode[]
  columnsMap: Record<string, IColumnNode>
  rowsMap: Record<string, IRowNode>
}

type FileCellInfo = {
  hash: string
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

    for (const cell of fileCells) {
      let rawFile: File

      const columnIndex = columns.findIndex((c) => c.id === cell.props.columnId)

      const rowIndex = rows.findIndex((c) => c.id === cell.props.rowId)

      const { googleDriveFileId = '', hash = '' } = cell.props.data

      const file = await db.file.where({ hash }).first()

      if (file) {
        rawFile = file.value
      } else {
        const { google } = await getAuthorizedUser()
        const drive = new GoogleDrive(google.access_token)
        if (googleDriveFileId) {
          rawFile = await drive.getFile(googleDriveFileId)
          console.log('====rawFile:', rawFile)
        } else {
          rawFile = null as any
        }
      }
      if (rawFile) {
        const url = URL.createObjectURL(rawFile)
        console.log('url:', url)

        cellFileRef.current[cell.id] = {
          hash,
          url,
          col: columnIndex,
          row: rowIndex,
        }
      }
    }

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
