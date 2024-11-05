'use client'

import { useRouterName } from '@/hooks/useRouterName'
import { NodePanels } from './NodePanels'

export function EditorApp() {
  const name = useRouterName()

  return <>{name === 'NODE' && <NodePanels />}</>
}
