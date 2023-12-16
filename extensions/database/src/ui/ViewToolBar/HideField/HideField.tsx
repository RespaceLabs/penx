import React, { FC } from 'react'
import { Eye, EyeOff, HomeIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from 'uikit'
import { useDatabaseContext } from '../../DatabaseContext'
import { ToolbarBtn } from '../ToolbarBtn'
import { HideFieldOverlay } from './HideFieldOverlay'

export const HideField = () => {
  const { currentView } = useDatabaseContext()
  const count = currentView.props.columns.filter((i) => !i.visible).length

  return (
    <Popover placement="bottom">
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
