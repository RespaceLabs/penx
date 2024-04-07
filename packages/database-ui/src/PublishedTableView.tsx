import {
  PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useLayer } from 'react-laag'
import { Box, css } from '@fower/react'
import { DataEditor, Rectangle } from '@glideapps/glide-data-grid'
import { Node } from '@penx/model'
import {
  ICellNode,
  IColumnNode,
  IDatabaseNode,
  INode,
  IOptionNode,
  IRowNode,
  IViewNode,
  ViewType,
} from '@penx/model-types'
import { cellRenderers } from './cells'
import { usePublishedTableView } from './hooks/usePublishedTableView'

interface Props {
  nodes: INode[]
}
export const PublishedTableView = ({ nodes }: Props) => {
  const database = nodes.find((n) => new Node(n).isDatabase) as IDatabaseNode
  const rows = nodes
    .filter((n) => new Node(n).isRow)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    ) as IRowNode[]
  const columns = nodes.filter((n) => new Node(n).isColumn) as IColumnNode[]
  const cells = nodes.filter((n) => new Node(n).isCell) as ICellNode[]
  const options = nodes.filter((n) => new Node(n).isOption) as IOptionNode[]
  const currentView = nodes.find(
    (n) => new Node(n).isView && n.props.viewType === ViewType.TABLE,
  ) as IViewNode

  const sortedColumns = useMemo(() => {
    if (!currentView) return []
    let { viewColumns = [] } = currentView.props
    return viewColumns
      .map(({ columnId }) => {
        return columns.find((col) => col.id === columnId)!
      })
      .filter((col) => !!col)
  }, [currentView, columns])

  const { cols, getContent, onColumnResize, onColumnResizeEnd } =
    usePublishedTableView({
      database,
      rows,
      columns,
      cells,
      currentView,
      sortedColumns,
      options,
    })

  const headerHeight = 60

  return (
    <Box bgViolet600 h-100vh w-100vw>
      <Box h={headerHeight} px-20 fontBold text2XL white toCenterY>
        {database.props.name}
      </Box>
      <DataEditor
        // className={css('roundedXL shadowPopover')}
        className={css('roundedXL mx-auto')}
        columns={cols}
        rows={rows.length}
        freezeColumns={1}
        smoothScrollX
        smoothScrollY
        // height={200}
        height={`calc(100vh - ${headerHeight + 20}px)`}
        width={`calc(100vw - 40px)`}
        rowMarkers="number"
        getCellsForSelection={true}
        customRenderers={cellRenderers}
        getCellContent={getContent}
        onColumnResize={onColumnResize}
        onColumnResizeEnd={onColumnResizeEnd}
        onCellContextMenu={(cell, e) => {
          e.preventDefault()
        }}
      />
    </Box>
  )
}
