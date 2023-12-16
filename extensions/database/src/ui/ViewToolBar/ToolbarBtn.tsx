import React, { forwardRef, PropsWithChildren } from 'react'
import { Box } from '@fower/react'
import { upFirst } from '@fower/utils'
import { Button } from 'uikit'

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
      borderNone
      size="sm"
      textSM
      variant="ghost"
      {...rest}
      colorScheme="gray600"
      {...hightLightProps}
    >
      <Box inlineFlex>{icon}</Box>
      <Box>{children}</Box>
    </Button>
  )
})
