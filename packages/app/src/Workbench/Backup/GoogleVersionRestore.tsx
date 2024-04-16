import { forwardRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { Box } from '@fower/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import {
  Button,
  modalController,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  toast,
  usePopoverContext,
} from 'uikit'
import { ModalNames } from '@penx/constants'
import { DriveFile, GoogleDrive } from '@penx/google-drive'
import { db } from '@penx/local-db'
import { decryptByMnemonic } from '@penx/mnemonic'
import { User } from '@penx/model'
import { INode } from '@penx/model-types'
import { normalizeNodes } from '@penx/shared'
import { getAuthorizedUser } from '@penx/storage'
import { store } from '@penx/store'
import { useSelectedSpace } from './hooks/useSelectedSpace'
import { SpacesSelect } from './SpacesSelect'

const CustomInput = forwardRef<HTMLDivElement, any>(function CustomInput(
  { onClick, ...rest },
  ref,
) {
  return (
    <Box
      ref={ref}
      gray500
      bgSlate100
      h-40
      rounded-8
      px3
      inlineFlex
      cursorPointer
      gap1
      toCenterY
      onClick={onClick}
    >
      <CalendarDays size={20} />
      <Box gray800>{rest.value}</Box>
    </Box>
  )
})

export function GoogleVersionRestore() {
  const [date, setDate] = useState(new Date())
  const { space } = useSelectedSpace()
  // console.log('======space:', space)

  return (
    <Box column gap2>
      {/* <Box heading2>Restore data from Google drive</Box> */}

      <Box toCenterY gap8>
        <Box w-200>
          <SpacesSelect />
        </Box>

        <Box toCenterY gap2>
          <DatePicker
            selected={date}
            onChange={(date) => {
              setDate(date!)
            }}
            customInput={<CustomInput />}
          />
        </Box>
      </Box>
      {!!space && <BackList date={date} />}
    </Box>
  )
}

// interface {}

interface BackListProps {
  date: Date
}

function BackList({ date }: BackListProps) {
  const { space } = useSelectedSpace()
  const dayStr = format(date || new Date(), 'yyyy-MM-dd')

  const { data, isLoading } = useQuery(
    ['data', dayStr, space.id],
    async () => {
      const data = await getAuthorizedUser()
      const user = new User(data)
      const dateFolderName = `space_${space.id}_${dayStr}`

      const drive = new GoogleDrive(user.google.access_token)
      const files = await drive.listByName(dateFolderName)

      if (!files.length) return []

      const dayFolderId = files[0].id

      const spaceFiles = await drive.listFileInFolder(dayFolderId)

      // console.log('=============spaceFiles:', spaceFiles)

      return spaceFiles || []
    },
    { enabled: !!space?.raw },
  )

  if (isLoading) {
    return <Spinner />
  }

  if (!data?.length) {
    // console.log('===============data:', data)
    return (
      <Box gray500>
        <Box>No data found in this day!</Box>
      </Box>
    )
  }

  return (
    <Box mt2 pb5>
      <Box column gap1>
        {data?.map((item) => <BackupItem key={item.id} file={item} />)}
      </Box>
    </Box>
  )
}

interface BackupItemProps {
  file: DriveFile
}

function BackupItem({ file }: BackupItemProps) {
  const [, time] = file.name.split('_')
  const date = new Date(time.replace('.json', ''))

  const timeStr = format(new Date(date), 'yyyy-MM-dd HH:mm:ss')

  return (
    <Box key={file.id} toCenterY gap4 textSM gray500>
      <Box gray800 flex-2>
        {file.id}
      </Box>
      <Box flex-1>{timeStr}</Box>
      <Box flex-1 toRight toCenterY>
        <Popover placement="left">
          <PopoverTrigger>
            <Button size="sm" variant="ghost">
              Restore
            </Button>
          </PopoverTrigger>
          <PopoverContent p5 column gap2 maxW-360>
            <Box textLG fontSemibold leadingNone>
              Restore from Google drive
            </Box>
            <Box gray500>It will replace your local data with backup data</Box>
            <Box toCenterY gap3>
              <PopoverClose asChild>
                <Button colorScheme="white">Cancel</Button>
              </PopoverClose>
              <ConfirmButton file={file} />
            </Box>
          </PopoverContent>
        </Popover>
      </Box>
    </Box>
  )
}

function ConfirmButton({ file }: BackupItemProps) {
  const { mutateAsync, isLoading } = useMutation(
    ['restore_from_google', file.id],
    async () => {
      const data = await getAuthorizedUser()
      const user = new User(data)

      const drive = new GoogleDrive(user.google.access_token)

      let result = await drive.getJSON(file.id)

      console.log('======result:', result)

      let nodes = result.nodes as INode[]

      const mnemonic = store.user.getMnemonic()

      nodes = nodes.map<INode>((n) => ({
        ...n,
        element: JSON.parse(decryptByMnemonic(n.element as string, mnemonic)),
        props: JSON.parse(decryptByMnemonic(n.props as any, mnemonic)),
      }))

      nodes = normalizeNodes(nodes)

      const currentNodes = await db.listNodesBySpaceId(nodes[0].spaceId)

      for (const item of currentNodes) {
        await db.deleteNode(item.id)
      }

      for (const item of nodes) {
        await db.createNode({
          ...item,
        })
      }
    },
  )
  const { close } = usePopoverContext()

  return (
    <Button
      disabled={isLoading}
      gap2
      onClick={async () => {
        try {
          await mutateAsync()
          close()
          modalController.close(ModalNames.SETTINGS)
          toast.success('Restored from Google drive!')
        } catch (error: any) {
          toast.error(error.message)
          console.log('error:', error)
        }
      }}
    >
      {isLoading && <Spinner square4 white />}
      <Box>Confirm</Box>
    </Button>
  )
}
