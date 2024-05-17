import { useRef, useState } from 'react'
import SVG from 'react-inlinesvg'
import { Box, css, styled } from '@fower/react'
import { open } from '@tauri-apps/api/shell'
import { Command } from 'cmdk'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { EventType, ListItem } from 'penx'
import clipboard from 'tauri-plugin-clipboard-api'
// import { Command } from '@penx/cmdk'
import { db } from '@penx/local-db'
import { useCommandPosition } from '~/hooks/useCommandPosition'
import { useCurrentCommand } from '~/hooks/useCurrentCommand'
import {
  useCommands,
  useDetail,
  useItems,
  useQueryCommands,
} from '~/hooks/useItems'
import { useReset } from '~/hooks/useReset'
import { CommandApp } from './CommandApp'

const StyledCommand = styled(Command)
const CommandInput = styled(Command.Input)
const CommandList = styled(Command.List)
const CommandItem = styled(Command.Item)

type CommandItem = {
  command: string
  code: string
}

interface ItemIconProps {
  icon: string
}
function ItemIcon({ icon }: ItemIconProps) {
  if (!icon) {
    return <Box square5 bgNeutral300 rounded-6></Box>
  }

  if (icon.startsWith('/')) {
    return (
      <Image
        src={icon}
        alt=""
        width={20}
        height={20}
        style={{ borderRadius: 6 }}
      />
    )
  }

  const isSVG = icon.startsWith('<svg')
  if (isSVG) {
    return (
      <SVG className={css({ square: 20, rounded: 6 })} src={icon as string} />
    )
  }
  return (
    <Box as="img" square5 rounded-6 src={`data:image/png;base64, ${icon}`} />
  )
}

export const CmdkRoot = () => {
  const [q, setQ] = useState('')
  const { items, setItems } = useItems()
  const { commands } = useCommands()
  const { detail, setDetail } = useDetail()
  const ref = useRef<HTMLInputElement>()

  const { position, isRoot, isCommandApp, setPosition } = useCommandPosition()
  const { currentCommand, setCurrentCommand } = useCurrentCommand()

  useQueryCommands()

  useReset(setQ)

  async function handleSelect(item: ListItem, input = '') {
    if (item.type === 'command') {
      // if (!q) setQ(item.title as string)

      setCurrentCommand(item)

      setPosition('COMMAND_APP')

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
      // shadow="0 16px 70px rgba(0,0,0,.2)"
      w={['100%']}
      column
      absolute
      top-0
      left0
      right0
      bottom0
      zIndex-10000
      // bgNeutral100
      bgWhite
      style={
        {
          // backdropFilter: 'blur(200px)',
        }
      }
      loop
      filter={(value, search) => {
        // console.log('value:', value, 'search:', search)
        return 1
      }}
    >
      <Box toCenterY>
        {isCommandApp && (
          <Box pl3 mr--8>
            <ArrowLeft size={20}></ArrowLeft>
          </Box>
        )}
        <CommandInput
          ref={ref as any}
          id="searchBarInput"
          flex-1
          selectNone
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
              // const [a, b = ''] = splitStringByFirstSpace(q)
              // const item = commands.find((item) => item.title === a)
              // if (item) {
              //   handleSelect(item, String(b))
              // }
              if (!q && isCommandApp) {
                setPosition('ROOT')
              }
            }
          }}
        />
      </Box>
      <Box flex-1>
        {isCommandApp && currentCommand && <CommandApp />}
        <CommandList flex-1 p2>
          <Command.Group>
            {isRoot &&
              items.map((item, index) => {
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
                    toBetween
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
                    <Box toCenterY gap2>
                      <ItemIcon icon={item.icon as string}></ItemIcon>
                      <Box text-15>{title}</Box>
                      <Box textSM gray500>
                        {subtitle}
                      </Box>
                    </Box>
                    <Box textXS gray400>
                      Command
                    </Box>
                  </CommandItem>
                )
              })}
          </Command.Group>
        </CommandList>
      </Box>

      <Box
        data-tauri-drag-region
        h-48
        borderTop
        borderNeutral200
        toCenterY
        px4
        toBetween
      >
        <Image
          src="/logo/128x128.png"
          alt=""
          width={20}
          height={20}
          style={{ borderRadius: 6 }}
        />
        <Box data-tauri-drag-region flex-1 h-100p></Box>
        <Box textSM gray400>
          CMD+K
        </Box>
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
