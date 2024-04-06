import { Box } from '@fower/react'
import {
  CalendarDays,
  Home,
  KanbanSquare,
  LayoutGrid,
  List,
  Table,
} from 'lucide-react'
import { ViewType } from '@penx/model-types'

interface Props {
  index?: number
  viewType: `${ViewType}`
  size?: number
}

export const ViewIcon = ({ viewType, size = 16, index }: Props) => {
  const iconsMap: Record<ViewType, any> = {
    [ViewType.TABLE]: Table,
    [ViewType.LIST]: List,
    [ViewType.GALLERY]: LayoutGrid,
    [ViewType.KANBAN]: KanbanSquare,
    [ViewType.CALENDAR]: CalendarDays,
  }
  let Icon = iconsMap[viewType]

  if (index === 0) Icon = Home

  if (Icon)
    return (
      <Box gray500 inlineFlex>
        <Icon size={size} />
      </Box>
    )
  return null
}
