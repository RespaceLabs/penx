import { useState } from 'react'
import Markdown from 'react-markdown'
import { Box, styled } from '@fower/react'
import { open } from '@tauri-apps/api/shell'
import { Command } from 'cmdk'
import { EventType, ListItem } from 'penx'
import clipboard from 'tauri-plugin-clipboard-api'
// import { Command } from '@penx/cmdk'
import { db } from '@penx/local-db'
import { useInstallBuiltinExtension } from '~/hooks/useInstallBuiltinExtension'
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
  const [detail, setDetail] = useState<string>('')

  useQueryCommands()
  useInstallBuiltinExtension()

  async function handleSelect(item: ListItem, input = '') {
    console.log('===============item:', item)

    if (item.type === 'command') {
      if (!q) setQ(item.title as string)

      const ext = await db.getExtensionBySlug(item.data.extensionSlug)
      if (!ext) return

      const command = ext.commands.find(
        (c) => c.name === item.data.commandName,
      )!

      let worker: Worker
      if (command.isBuiltIn) {
        worker = new Worker(
          new URL('../workers/clipboard-history.ts', import.meta.url),
          {
            type: 'module',
          },
        )
      } else {
        console.log('=========command?.code:, ', command?.code)

        let blob = new Blob([`self.input = '${input}'\n` + command?.code], {
          type: 'application/javascript',
        })
        const url = URL.createObjectURL(blob)
        worker = new Worker(url)
      }
      // worker.terminate()

      item.data.commandName && worker.postMessage(item.data.commandName)

      worker.onmessage = async (event: MessageEvent<any>) => {
        if (event.data?.type === EventType.RenderList) {
          const list: ListItem[] = event.data.items || []
          console.log('event--------:', event.data.items)

          const newItems = list.map<ListItem>((item) => ({
            type: 'list-item',
            ...item,
          }))

          setItems(newItems)
        }

        if (event.data?.type === EventType.RenderMarkdown) {
          const content = event.data.content as string
          setDetail(content)
          setItems([])
          console.log('event......:', event)
        }
      }
    }

    if (item.type === 'list-item') {
      if (item.actions?.[0]) {
        const defaultAction = item.actions?.[0]
        if (defaultAction.type === 'OpenInBrowser') {
          console.log('========defaultAction.url:', defaultAction.url)
          open(defaultAction.url)
        }

        if (defaultAction.type === 'CopyToClipboard') {
          await clipboard.writeText(defaultAction.content)
        }
      }
      console.log('list item:', item)
    }
  }

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
        // console.log('value:', value, 'search:', search)
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
        placeholder="Search something..."
        autoFocus
        value={q}
        onValueChange={(v) => {
          setQ(v)
          if (v === '') {
            setItems(commands)
            setDetail('')
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
      <Box flex-1>
        {detail && (
          <Box p4>
            <Markdown>{detail}</Markdown>
          </Box>
        )}
        <CommandList flex-1 p2={!detail}>
          {!detail && <Command.Empty>No results found.</Command.Empty>}

          <Command.Group>
            {items.map((item, index) => {
              const title =
                typeof item.title === 'string' ? item.title : item.title.value

              const subtitle =
                typeof item.subtitle === 'string'
                  ? item.subtitle
                  : item.subtitle?.value
              return (
                <CommandItem
                  key={index}
                  cursorPointer
                  toCenterY
                  px2
                  py3
                  gap2
                  roundedLG
                  black
                  value={title}
                  onSelect={() => {
                    handleSelect(item)
                  }}
                  onClick={() => {
                    handleSelect(item)
                  }}
                >
                  <Box textBase>{title}</Box>
                  <Box textSM gray500>
                    {subtitle}
                  </Box>
                </CommandItem>
              )
            })}
          </Command.Group>
        </CommandList>
      </Box>

      <Box h-48 borderTop borderNeutral200--T40 toCenterY px4></Box>
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
