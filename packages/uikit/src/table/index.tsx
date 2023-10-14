import { ReactNode } from 'react'
import { Box } from '@fower/react'
import RcTable from 'rc-table'
import { GetRowKey, TableComponents } from 'rc-table/lib/interface'

interface Props<RecordType = any> {
  rowKey?: string | GetRowKey<any>
  columns: any[]
  data: any
  components?: TableComponents<RecordType>
  bordered?: boolean
}

interface ColumnType<RecordType = any> {
  title?: string
  dataIndex?: string
  key?: string
  render?: (value: any, record: RecordType, index: number) => ReactNode
  width?: number | string
  [key: string]: any
}

export type ColumnsType<RecordType = any> = ColumnType<RecordType>[]

export const Table = ({
  columns,
  data,
  rowKey,
  components,
  bordered = true,
}: Props) => {
  return (
    <RcTable
      columns={columns}
      data={data}
      rowKey={rowKey}
      components={{
        table: (props: any) => (
          <Box
            as="table"
            w-100p
            {...props}
            css={{
              borderCollapse: 'collapse',
            }}
          />
        ),

        header: {
          cell: (props: any) => (
            <Box as="th" px3 py2 textLeft fontSemibold gray400 {...props} />
          ),
        },
        body: {
          row: (props: any) => <Box as="tr" {...props} />,
          cell: (props: any) => (
            <Box
              as="td"
              borderBottom={bordered}
              borderBottomGray200={bordered}
              borderGray800--dark={bordered}
              px3
              py2
              textLeft
              {...props}
              contentEditable={false}
            />
          ),
        },
        ...components,
      }}
    />
  )
}
