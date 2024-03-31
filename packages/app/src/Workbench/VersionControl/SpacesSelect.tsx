import { useEffect, useState } from 'react'
import { Box } from '@fower/react'
import {
  Select,
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'uikit'
import { useActiveSpace, useSpaces } from '@penx/hooks'
import { Space } from '@penx/model'
import { useSelectedSpace } from './hooks/useSelectedSpace'

export function SpacesSelect() {
  const { spaces } = useSpaces()
  const { activeSpace } = useActiveSpace()
  const { space, setSpace } = useSelectedSpace()

  useEffect(() => {
    if (activeSpace) setSpace(activeSpace)
  }, [])

  return (
    <Select
      value={space?.id || ''}
      onChange={(v: string) => {
        const space = spaces.find((s) => s.id === v)!
        setSpace(new Space(space))
      }}
    >
      <SelectTrigger bgSlate100 w-200>
        <SelectValue placeholder="Select a space"></SelectValue>
        <SelectIcon></SelectIcon>
      </SelectTrigger>
      <SelectContent>
        {spaces?.map((item) => (
          <SelectItem key={item.id} value={item.id} toBetween>
            <Box flex-1>{item.name}</Box>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
