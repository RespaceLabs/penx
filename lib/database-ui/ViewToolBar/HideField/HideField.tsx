import React, { FC } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useDatabaseContext } from '@/lib/database-context'
import { Eye, EyeOff, HomeIcon } from 'lucide-react'
import { ToolbarBtn } from '../ToolbarBtn'
import { HideFieldOverlay } from './HideFieldOverlay'

export const HideField = () => {
  const { currentView } = useDatabaseContext()

  if (!currentView) return null
  const { viewColumns = [] } = currentView.props
  const count = viewColumns.filter((i) => !i.visible).length

  return (
    <Popover>
      <PopoverTrigger>
        <ToolbarBtn
          isHighlight={!!count}
          hightLightColor="blue"
          icon={<EyeOff size={16} />}
        >
          {count > 0 && count} Hide Fields
        </ToolbarBtn>
      </PopoverTrigger>
      <PopoverContent>
        <HideFieldOverlay></HideFieldOverlay>
      </PopoverContent>
    </Popover>
  )
}
