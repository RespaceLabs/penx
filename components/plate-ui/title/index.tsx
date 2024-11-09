'use client'

import React from 'react'
import { ITitleElement } from '@/components/editor/plugins/title-plugin'
import { NodeType } from '@/lib/model'
import { cn, withRef } from '@udecode/cn'
import { PlateElementProps } from '@udecode/plate-common/react'
import { CommonTitle } from './CommonTitle'
import { CoverUpload } from './CoverUpload'
import { DailyTitle } from './DailyTitle'

export const TitleElement = withRef(
  (props: PlateElementProps<ITitleElement>, ref) => {
    const element = props.element as ITitleElement
    const isDaily = element.nodeType === NodeType.DAILY
    const isDatabase = element.nodeType === NodeType.DATABASE
    const isDailyRoot = element.nodeType === NodeType.DAILY_ROOT

    return (
      <div
        {...props.attributes}
        className={cn(
          'text-foreground/80 relative mb-4 flex flex-col gap-0 pr-2 text-4xl font-bold',
          isDatabase && 'pl-9',
          isDailyRoot && 'pl-4',
        )}
      >
        <CoverUpload {...props} />
        {!isDaily && <CommonTitle {...props} />}
        {isDaily && <DailyTitle {...props} />}
      </div>
    )
  },
)
