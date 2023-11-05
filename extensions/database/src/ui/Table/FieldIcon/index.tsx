import { Box } from '@fower/react'
import { Hash, Lock } from 'lucide-react'
import { FieldType } from '@penx/types'
import { IconSingleLineText } from './IconSingleLineText'
import { IconSingleSelect } from './IconSingleSelect'

interface Props {
  fieldType: `${FieldType}`
  size?: number
}

export const FieldIcon = ({ fieldType, size = 14 }: Props) => {
  const iconsMap: Record<FieldType, any> = {
    [FieldType.Text]: IconSingleLineText,
    [FieldType.Number]: Hash,
    [FieldType.SingleSelect]: IconSingleSelect,
    [FieldType.CreatedAt]: Lock,
    [FieldType.UpdatedAt]: Lock,
  }
  const Icon = iconsMap[fieldType]

  if (Icon)
    return (
      <Box gray600>
        <Icon size={size} />
      </Box>
    )
  return null
}
