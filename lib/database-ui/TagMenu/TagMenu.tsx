import { useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useDatabaseContext } from '@/lib/database-context'
import { db, formatTagName, getColorNames } from '@/lib/local-db'
import { IDatabaseNode, Node } from '@/lib/model'
import { useCopyToClipboard } from '@/lib/shared'
import { store } from '@/store'

import { PopoverClose } from '@radix-ui/react-popover'
import { toast } from 'sonner'

interface Props {
  database: IDatabaseNode
}

function ColorSelector({ database }: Props) {
  const { updateDatabaseProps } = useDatabaseContext()
  const colorNames = getColorNames()

  async function selectColor(color: string) {
    updateDatabaseProps({ color })
    close()
  }

  return (
    <div className="flex items-center flex-wrap gap-2 p-4 justify-between ">
      {colorNames.map((color) => (
        <div
          key={color}
          // bg={color}
          // bg--T20--hover={color}
          className="w-6 h-6 rounded-full cursor-pointer transition-all hover:scale-110"
          title={color}
          onClick={() => selectColor(color)}
        />
      ))}
    </div>
  )
}

function Content() {
  const { database, updateDatabaseProps } = useDatabaseContext()
  const [name, setName] = useState(database.props.name)
  const { copy } = useCopyToClipboard()

  const node = new Node(database)

  const isBuiltin = node.isTodoDatabase || node.isFileDatabase

  return (
    <>
      {!isBuiltin && (
        <div className="px-3 pt-3">
          <Input
            size="sm"
            value={name}
            onBlur={() => {
              updateDatabaseProps({ name: formatTagName(name) })
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateDatabaseProps({ name: formatTagName(name) })
                // close()
              }
            }}
            onChange={(e) => {
              setName(e.target.value)
            }}
          />
        </div>
      )}

      <ColorSelector database={database} />
      {!isBuiltin && (
        <>
          <div
            onClick={() => {
              // modalController.open(ModalNames.DELETE_DATABASE, database)
              // close()
            }}
          >
            Delete database
          </div>
        </>
      )}

      <PopoverClose>
        <div
          onClick={() => {
            copy(database.id)
            toast.success('Copied to clipboard')
          }}
        >
          Copy database ID
        </div>
      </PopoverClose>
    </>
  )
}

export const TagMenu = () => {
  const { database } = useDatabaseContext()

  if (!database) return null
  const node = new Node(database)

  return (
    <div
      className="flex items-center left-3 top-[2px]"
      style={{ height: '1.5em' }}
    >
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center gap-1 cursor-pointer">
            <div
              // bg={database.props.color || 'black'}
              className="h-7 w-7 text-xs rounded-full flex items-center justify-between"
            >
              #
            </div>
            {/* <Box textLG fontBold>
              {node.title}
            </Box> */}
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <Content></Content>
        </PopoverContent>
      </Popover>
    </div>
  )
}
