import React, { forwardRef, PropsWithChildren } from 'react'
import { Button } from '@/components/ui/button'

import { upFirst } from '@fower/utils'

interface Props {
  icon?: React.ReactElement
  isHighlight: boolean
  hightLightColor: 'red' | 'blue' | 'orange' | 'green'
}

export const ToolbarBtn = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<Props>
>(function ToolbarBtn(
  { children, icon, isHighlight, hightLightColor, ...rest },
  ref,
) {
  const hightLightProps = isHighlight
    ? {
        [`bg${upFirst(hightLightColor)}200`]: true,
        [`bg${upFirst(hightLightColor)}200-D2--hover`]: true,
        [`${hightLightColor}800`]: true,
      }
    : {}

  return (
    <Button
      ref={ref as any}
      size="sm"
      variant="ghost"
      {...rest}
      {...hightLightProps}
    >
      <div className="inline-flex">{icon}</div>
      <div className="hidden md:block">{children}</div>
    </Button>
  )
})
