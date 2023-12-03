import { Box } from '@fower/react'
import { CheckCircle2, Hash, Home, Lock } from 'lucide-react'
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
    [FieldType.SingleSelect]: CheckCircle2,
    [FieldType.CreatedAt]: Lock,
    [FieldType.UpdatedAt]: Lock,
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
