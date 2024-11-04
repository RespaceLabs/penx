import {
  PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useLayer } from 'react-laag'
import {
  ICellNode,
  IColumnNode,
  IDatabaseNode,
  INode,
  IOptionNode,
  IRowNode,
  IViewNode,
  Node,
  ViewType,
} from '@/lib/model'
import { DataEditor, Rectangle } from '@glideapps/glide-data-grid'
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
    <div className="bg-violet-600 h-full w-screen">
      <div
        className="px-5 font-bold text-2xl text-white flex items-center"
        style={{ height: headerHeight }}
      >
        {database.props.name}
      </div>
      <DataEditor
        // className={css('roundedXL shadowPopover')}
        className={'mx-auto rounded-xl'}
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
    </div>
  )
}
