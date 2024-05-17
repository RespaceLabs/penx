import SVG from 'react-inlinesvg'
import { Box, css, styled } from '@fower/react'
import { Command } from 'cmdk'
import Image from 'next/image'
import { ListItem } from 'penx'
import { useHandleSelect } from '~/hooks/useHandleSelect'
import { ListItemIcon } from './ListItemIcon'

const StyledCommandItem = styled(Command.Item)

interface ListItemUIProps {
  item: ListItem
}

export const ListItemUI = ({ item }: ListItemUIProps) => {
  const handleSelect = useHandleSelect()

  const title = typeof item.title === 'string' ? item.title : item.title.value

  const subtitle =
    typeof item.subtitle === 'string' ? item.subtitle : item.subtitle?.value

  return (
    <StyledCommandItem
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
        <ListItemIcon icon={item.icon as string} />
        <Box text-15>{title}</Box>
        <Box textSM gray500>
          {subtitle}
        </Box>
      </Box>
      <Box textXS gray400>
        Command
      </Box>
    </StyledCommandItem>
  )
}
