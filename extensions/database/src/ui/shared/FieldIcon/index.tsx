import { Box } from '@fower/react'
import {
  CalendarDays,
  CheckCircle2,
  Hash,
  Home,
  Key,
  ListChecks,
} from 'lucide-react'
import { FieldType } from '@penx/model-types'
import { IconSingleLineText } from './IconSingleLineText'

interface Props {
  index?: number
  fieldType: `${FieldType}`
  size?: number
}

export const FieldIcon = ({ fieldType, size = 16, index }: Props) => {
  const iconsMap: Record<FieldType, any> = {
    [FieldType.Text]: IconSingleLineText,
    [FieldType.Number]: Hash,
    [FieldType.Password]: Key,
    [FieldType.SingleSelect]: CheckCircle2,
    [FieldType.MultipleSelect]: ListChecks,
    [FieldType.Date]: CalendarDays,
    [FieldType.CreatedAt]: CalendarDays,
    [FieldType.UpdatedAt]: CalendarDays,
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
