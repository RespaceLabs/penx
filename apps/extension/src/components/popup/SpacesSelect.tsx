import { Box } from '@fower/react'
import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'uikit'

import { useMySpaces, useSelectedSpace } from '../content/hooks'

interface SpacesSelectProps {}

export function SpacesSelect(props: SpacesSelectProps) {
  const [value, setValue] = useState<string>('')
  const { selectedSpace, setSelectedSpace } = useSelectedSpace()
  const { mySpaces } = useMySpaces()

  const onChange = (v: string) => {
    setValue(v)
    setSelectedSpace(v)
  }

  useEffect(() => {
    setValue(selectedSpace)
  }, [selectedSpace])

  return (
    <Box>
      <Box pb-10>Save to space:</Box>
      <Select value={value} onChange={(v: string) => onChange(v)}>
        <SelectTrigger bgSlate100 flex-1>
          <SelectValue placeholder="Select a space"></SelectValue>
          <SelectIcon></SelectIcon>
        </SelectTrigger>
        <SelectContent w-200>
          {mySpaces.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Box>
  )
}
