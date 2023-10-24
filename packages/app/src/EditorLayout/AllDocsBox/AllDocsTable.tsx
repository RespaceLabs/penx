import { Box } from '@fower/react'
import { Trash2 } from 'lucide-react'
import { Button, ColumnsType, Table } from 'uikit'
import { Node } from '@penx/model'
import { NodeService } from '@penx/service'
import { store } from '@penx/store'

interface Props {
  nodes: Node[]
}

export const AllDocsTable = ({ nodes }: Props) => {
  const columns: ColumnsType<Node> = [
    {
      title: 'Name',
      dataIndex: 'title',
      key: 'title',
      width: '50%',
      render(value) {
        if (!value) {
          return (
            <Box fontBold gray400>
              Untitled
            </Box>
          )
        }
        return <Box fontBold>{value}</Box>
      },
    },
    {
      title: 'Created time',
      dataIndex: 'createdAtFormatted',
      key: 'createdAtFormatted',
      render: (value) => <Box textXS>{value}</Box>,
    },
    {
      title: 'Updated time',
      dataIndex: 'updatedAtFormatted',
      key: 'updatedAtFormatted',
      render: (value) => <Box textXS>{value}</Box>,
    },
    {
      title: '',
      dataIndex: 'op',
      key: 'op',
      render(_, item) {
        return (
          <Box toCenterY gap1>
            <Button
              size={28}
              variant="ghost"
              colorScheme="gray500"
              isSquare
              onClick={async (e) => {
                e.stopPropagation()
                await store.trashNode(item.id)
              }}
            >
              <Trash2 />
            </Button>
          </Box>
        )
      },
    },
  ]

  return (
    <Table
      columns={columns}
      data={nodes}
      rowKey="id"
      bordered={false}
      components={{
        body: {
          row: (props: any) => (
            <Box
              as="tr"
              {...props}
              rounded2XL
              bgGray100--hover
              cursorPointer
              transitionColors
              onClick={async () => {
                const node = nodes.find(
                  (node) => node.id === props['data-row-key'],
                )

                await new NodeService(
                  new Node(node?.raw!),
                  store.getNodes().map((node) => new Node(node)),
                ).selectNode()
              }}
            />
          ),
          cell: (props: any) => {
            return (
              <Box
                as="td"
                px3
                py2
                textLeft
                {...props}
                contentEditable={false}
              />
            )
          },
        },
      }}
    />
  )
}
