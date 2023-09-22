import React, { ReactNode } from 'react'
import { HoverCardProvider } from './context'
import { HoverCardOptions, useHoverCard } from './useHoverCard'

export function HoverCard({
  children,
  modal = false,
  ...restOptions
}: {
  children: ReactNode
} & HoverCardOptions) {
  const hoverCard = useHoverCard({ modal, ...restOptions })

  return <HoverCardProvider value={hoverCard}>{children}</HoverCardProvider>
}
