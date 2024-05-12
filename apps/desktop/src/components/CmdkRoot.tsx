import { useState } from 'react'
import { Box, styled } from '@fower/react'
import { Command } from 'cmdk'
import { EventType, Item } from '@penx/extension-api'
import { db } from '@penx/local-db'
import { useCommands, useItems, useQueryCommands } from '~/hooks/useItems'

const StyledCommand = styled(Command)
const CommandInput = styled(Command.Input)
const CommandList = styled(Command.List)
const CommandItem = styled(Command.Item)

type CommandItem = {
  command: string
  code: string
}

export const CmdkRoot = () => {
  const [q, setQ] = useState('')

  const { items, setItems } = useItems()
  const { commands } = useCommands()

  useQueryCommands()

  async function handleSelect(item: Item, input = '') {
    if (item.type === 'command') {
      if (!q) setQ(item.title as string)

      const ext = await db.getExtensionBySlug(item.data.extensionSlug)
      if (!ext) return

      let blob = new Blob([`self.input = '${input}'\n` + ext?.code], {
        type: 'application/javascript',
      })
      let url = URL.createObjectURL(blob)
      let worker = new Worker(url)
      // worker.terminate()

      item.data.commandName && worker.postMessage(item.data.commandName)

      worker.onmessage = async (event: MessageEvent<any>) => {
        console.log('========event.data?.type:', event.data?.type)

        if (event.data?.type === EventType.RENDER_LIST) {
          const list: Array<{ title: string }> = event.data.items || []
          console.log('event---:', event.data.items)

          const newItems = list.map((item) => ({
            title: item.title,
          }))

          setItems(newItems)
        }
      }
    }
  }

  console.log('==========items:', items)

  return (
    <StyledCommand
      label="Command Menu"
      className="command-panel"
      shadow="0 16px 70px rgba(0,0,0,.2)"
      w={['100%']}
      column
      absolute
      top-0
      left0
      right0
      bottom0
      zIndex-10000
      bgNeutral100
      style={{
        backdropFilter: 'blur(200px)',
      }}
      loop
      filter={(value, search) => {
        console.log('value:', value, 'search:', search)
        return 1
      }}
    >
      <CommandInput
        id="searchBarInput"
        toCenterY
        bgTransparent
        w-100p
        h-54
        px3
        placeholderGray400
        textBase
        borderBottom
        borderGray200
        outlineNone
        placeholder="Search node"
        autoFocus
        value={q}
        onValueChange={(v) => {
          setQ(v)
          if (v === '') {
            setItems(commands)
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const [a, b = ''] = splitStringByFirstSpace(q)
            const item = commands.find((item) => item.title === a)
            if (item) {
              handleSelect(item, String(b))
            }
          }
        }}
      />
      <CommandList flex-1 p2>
        <Command.Empty>No results found.</Command.Empty>

        <Command.Group>
          {items.map((item, index) => {
            const title =
              typeof item.title === 'string' ? item.title : item.title.value
            return (
              <CommandItem
                key={index}
                cursorPointer
                toCenterY
                px2
                py3
                gap2
                roundedLG
                value={title}
                onSelect={() => {
                  handleSelect(item)
                }}
                onClick={() => {
                  handleSelect(item)
                }}
              >
                <Box textSM>{title}</Box>
              </CommandItem>
            )
          })}
        </Command.Group>
      </CommandList>

      <Box h-48 borderTop borderNeutral200--T40 toCenterY px4>
        Bottom bar
      </Box>
    </StyledCommand>
  )
}

function splitStringByFirstSpace(str: string) {
  const index = str.indexOf(' ')
  if (index === -1) {
    return [str]
  }

  const firstPart = str.substring(0, index)
  const secondPart = str.substring(index + 1).trim()

  return [firstPart, secondPart]
}
