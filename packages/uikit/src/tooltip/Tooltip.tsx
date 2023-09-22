import React, { ReactNode } from 'react'
import { TooltipProvider } from './context'
import { TooltipOptions, useTooltip } from './useTooltip'

export function Tooltip({
  children,
  modal = false,
  ...restOptions
}: {
  children: ReactNode
} & TooltipOptions) {
  const tooltip = useTooltip({ modal, ...restOptions })

  return <TooltipProvider value={tooltip}>{children}</TooltipProvider>
}
