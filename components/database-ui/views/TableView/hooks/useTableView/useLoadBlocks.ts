import { RefObject, useEffect, useRef } from 'react'
import { Database } from '@/components/database-ui/DatabaseProvider'
import { api } from '@/lib/trpc'
import { Block } from '@/server/db/schema'
import { DataEditorRef } from '@glideapps/glide-data-grid'

type RefCellInfo = {
  block: Block
  col: number
  row: number
}

type RefBlockCell = {
  refType: 'BLOCK'
  id: string
}

function isRefBlock(cellValue: any): cellValue is RefBlockCell {
  return cellValue?.refType === 'BLOCK' && typeof cellValue?.id === 'string'
}

export function useLoadBlocks(
  gridRef: RefObject<DataEditorRef>,
  database: Database,
) {
  const cellBlockRef = useRef<Record<string, RefCellInfo>>({})

  async function loadRefBlock() {
    for (const { id, isPrimary } of database.fields) {
      if (!isPrimary) continue

      let index = 0
      for (const record of database.records) {
        // if(record.fields)
        const fields = record.fields as Record<string, any>
        const cellValue = fields[id]
        if (isRefBlock(cellValue)) {
          const block = await api.block.byId.query(cellValue.id)
          // console.log('====block:', block)
          cellBlockRef.current[record.id] = {
            block,
            col: 0,
            row: index,
          }
        }
        index++
      }
    }

    gridRef.current?.updateCells(
      Object.keys(cellBlockRef.current).map((id) => ({
        cell: [cellBlockRef.current[id].col, cellBlockRef.current[id].row],
      })),
    )
  }

  useEffect(() => {
    setTimeout(() => {
      loadRefBlock()
    }, 0)
  }, [])

  return { cellBlockRef }
}
