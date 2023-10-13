import { Box } from '@fower/react'
import { Trans } from '@lingui/macro'
import { RotateCcw, Trash2 } from 'lucide-react'
import {
  Button,
  ColumnsType,
  Table,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from 'uikit'
import { Doc } from '@penx/domain'

interface Props {
  docs: Doc[]
}

export const TrashTable = ({ docs }: Props) => {
  const columns: ColumnsType<Doc> = [
    {
      title: 'Name',
      dataIndex: 'title',
      key: 'title',
      width: '50%',
      render(value) {
        return <Box fontBold>{value}</Box>
      },
    },
    {
      title: 'Created time',
      dataIndex: 'createdAtFormatted',
      key: 'createdAtFormatted',
    },
    {
      title: 'Updated time',
      dataIndex: 'updatedAtFormatted',
      key: 'updatedAtFormatted',
    },
    {
      title: '',
      dataIndex: 'op',
      key: 'op',
      render(_, item) {
        return (
          <Box toCenterY gap1>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  size={28}
                  variant="ghost"
                  colorScheme="gray500"
                  isSquare
                  onClick={() => {
                    console.log('seerer')
                  }}
                >
                  <RotateCcw />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Restore</TooltipContent>
            </Tooltip>

            <Button size={28} variant="ghost" colorScheme="gray500" isSquare>
              <Trash2 />
            </Button>
          </Box>
        )
      },
    },
  ]

  return <Table columns={columns} data={docs} rowKey="id" />
}
