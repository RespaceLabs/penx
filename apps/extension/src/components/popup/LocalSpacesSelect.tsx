import { Box } from '@fower/react'
import { Cloud, KeyRound, Laptop } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'uikit'

import { useLocalSpaces } from '~/hooks/useLocalSpaces'

export function LocalSpacesSelect() {
  const { loading, activeSpace, spaces, setActiveSpace } = useLocalSpaces()

  if (loading) return null

  return (
    <Box mt2>
      <Box mb2 fontMedium textBase>
        Add to space
      </Box>
      <Select
        value={activeSpace.id}
        onChange={(v: string) => {
          const space = spaces.find((item) => item.id === v)
          setActiveSpace(space)
        }}>
        <SelectTrigger bgSlate100 flex-1>
          <SelectValue placeholder="Select a space"></SelectValue>
          <SelectIcon></SelectIcon>
        </SelectTrigger>
        <SelectContent w-200>
          {spaces?.map((item) => (
            <SelectItem key={item.id} value={item.id} toBetween>
              <Box flex-1>{item.name}</Box>

              <Box toCenterY gap1 gray600>
                {item.encrypted && <KeyRound size={16} />}
                {item.isCloud && <Cloud size={16} />}
                {!item.isCloud && <Laptop size={16} />}
              </Box>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Box>
  )
}
