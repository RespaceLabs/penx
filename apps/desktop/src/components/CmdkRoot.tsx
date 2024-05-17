import { useRef, useState } from 'react'
import SVG from 'react-inlinesvg'
import { Box, css, styled } from '@fower/react'
import { Command } from 'cmdk'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { EventType, ListItem } from 'penx'
// import { Command } from '@penx/cmdk'
import { useCommandPosition } from '~/hooks/useCommandPosition'
import { useCurrentCommand } from '~/hooks/useCurrentCommand'
import { useCommands, useItems, useQueryCommands } from '~/hooks/useItems'
import { useReset } from '~/hooks/useReset'
import { CommandApp } from './CommandApp/CommandApp'
import { ListItemUI } from './ListItemUI'

const StyledCommand = styled(Command)
const StyledCommandInput = styled(Command.Input)
const StyledCommandList = styled(Command.List)

export const CmdkRoot = () => {
  const [q, setQ] = useState('')
  const { items, setItems } = useItems()
  const { commands } = useCommands()
  const ref = useRef<HTMLInputElement>()

  const { position, isRoot, isCommandApp, setPosition } = useCommandPosition()
  const { currentCommand } = useCurrentCommand()

  useQueryCommands()

  useReset(setQ)

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
      <Box toCenterY borderBottom borderGray200>
        {isCommandApp && (
          <Box pl3 mr--8>
            <ArrowLeft size={20}></ArrowLeft>
          </Box>
        )}
        <StyledCommandInput
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
          outlineNone
          placeholder="Search something..."
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
        <StyledCommandList flex-1 p2={isRoot}>
          <Command.Group>
            {isRoot &&
              items.map((item, index) => {
                return <ListItemUI key={index} item={item} />
              })}
          </Command.Group>
        </StyledCommandList>
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
