import { Box } from '@fower/react'
import {
  CalendarDays,
  CheckCircle2,
  Hash,
  Home,
  Key,
  ListChecks,
  Text,
} from 'lucide-react'
import { FieldType } from '@penx/model-types'

interface Props {
  index?: number
  fieldType: `${FieldType}`
  size?: number
}

export const FieldIcon = ({ fieldType, size = 16, index }: Props) => {
  const iconsMap: Record<FieldType, any> = {
    [FieldType.TEXT]: Text,
    [FieldType.NUMBER]: Hash,
    [FieldType.PASSWORD]: Key,
    [FieldType.SINGLE_SELECT]: CheckCircle2,
    [FieldType.MULTIPLE_SELECT]: ListChecks,
    [FieldType.DATE]: CalendarDays,
    [FieldType.CREATED_AT]: CalendarDays,
    [FieldType.UPDATED_AT]: CalendarDays,
  }
  let Icon = iconsMap[fieldType]

  if (index === 0) Icon = Home

  if (Icon)
    return (
      <Box gray500>
        <Icon size={size} />
      </Box>
    )
  return null
}
