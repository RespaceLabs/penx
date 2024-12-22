'use client'

import {
  CalendarDays,
  CheckCircle2,
  Hash,
  Home,
  Key,
  Link,
  ListChecks,
  Text,
} from 'lucide-react'
import { FieldType } from '@/lib/types'

interface Props {
  index?: number
  // fieldType: `${FieldType}`
  fieldType: any
  size?: number
}

export const FieldIcon = ({ fieldType, size = 16, index }: Props) => {
  const iconsMap: Record<string, any> = {
    [FieldType.TEXT]: Text,
    [FieldType.NUMBER]: Hash,
    [FieldType.URL]: Link,
    [FieldType.PASSWORD]: Key,
    [FieldType.SINGLE_SELECT]: CheckCircle2,
    [FieldType.MULTIPLE_SELECT]: ListChecks,
    [FieldType.MARKDOWN]: Text,
    [FieldType.DATE]: CalendarDays,
    [FieldType.CREATED_AT]: CalendarDays,
    [FieldType.UPDATED_AT]: CalendarDays,
  }
  let Icon = iconsMap[fieldType]

  if (index === 0) Icon = Home

  if (Icon)
    return (
      <div className="text-foreground/500 inline-flex">
        <Icon size={size} />
      </div>
    )
  return null
}
