import { Box } from '@fower/react'
import { RotateCcw, Trash2 } from 'lucide-react'
import {
  Button,
  ColumnsType,
  modalController,
  Table,
  toast,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from 'uikit'
import { ModalNames } from '@penx/constants'
import { Doc } from '@penx/domain'
import { store } from '@penx/store'
import { DeleteDocModal } from './DeleteDocModal'

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
            <Tooltip>
              <TooltipTrigger>
                <Button
                  size={28}
                  variant="ghost"
                  colorScheme="gray500"
                  isSquare
                  onClick={async (e) => {
                    await store.restoreDoc(item.id)
                    toast.info(`${item.title} restored`)
                  }}
                >
                  <RotateCcw />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Restore</TooltipContent>
            </Tooltip>

            <Button
              size={28}
              variant="ghost"
              colorScheme="gray500"
              isSquare
              onClick={() => {
                modalController.open(ModalNames.DeleteDoc, item)
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
    <Box>
      <DeleteDocModal />
      <Table columns={columns} data={docs} rowKey="id" bordered={false} />
    </Box>
  )
}
