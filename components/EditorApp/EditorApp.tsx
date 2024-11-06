'use client'

import { WORKBENCH_NAV_HEIGHT } from '@/lib/constants'
import { Node } from '@/lib/model'
import dynamic from 'next/dynamic'
import LoadingDots from '../icons/loading-dots'
import { Skeleton } from '../ui/skeleton'
import NodeEditorApp from './NodeEditorApp'

const DynamicNodeEditorApp = dynamic(() => import('./NodeEditorApp'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex flex-col">
      <div
        className="flex justify-between items-center px-4"
        style={{
          height: WORKBENCH_NAV_HEIGHT,
        }}
      >
        <Skeleton className="h-4 w-36"></Skeleton>
        <Skeleton className="h-10 w-28"></Skeleton>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <LoadingDots className="bg-foreground/60"></LoadingDots>
      </div>
    </div>
  ),
})

interface EditorAppProps {
  node: Node
}
export function EditorApp({ node }: EditorAppProps) {
  // return <DynamicNodeEditorApp node={node} />
  return <NodeEditorApp node={node}></NodeEditorApp>
}
