import { useState } from 'react'
import { WORKBENCH_NAV_HEIGHT } from '@/lib/constants'
import { Node } from '@/lib/model'
import { NodeProvider, useNodes } from '@/lib/node-hooks'
import { nodeToSlate } from '@/lib/serializer'
import { NodeService } from '@/lib/service'
import { useDebouncedCallback } from 'use-debounce'
import { NodeEditor } from './NodeEditor'
import { PCNav } from './NodeNav/PCNav'

interface Props {
  node: Node
}

export function NodeEditorApp({ node }: Props) {
  const { nodes, nodeList } = useNodes()
  const nodeService = new NodeService(node, nodes)
  const [saving, setSaving] = useState(false)
  // console.log('node=======:', node)

  const isOutliner = false

  const content = nodeToSlate({
    node: node.raw,
    nodes: nodeList.rawNodes,
    isOutliner,
    isOutlinerSpace: false,
  })

  const debouncedSaveNodes = useDebouncedCallback(async (value: any[]) => {
    await nodeService.saveBlockEditor(node.raw, value)
  }, 300)

  return (
    <NodeProvider value={{ node }}>
      <div className="relative h-screen flex-1 px-2 md:px-0 py-2 md:py-0">
        <PCNav></PCNav>
        <div
          className="mx-auto md:max-w-[750px] pt-14 pl-0 sm:pl-10 pr-0 sm:pr-1 break-words pb-20"
          style={{
            minHeight: `calc(100vh - ${WORKBENCH_NAV_HEIGHT}px)`,
          }}
        >
          <NodeEditor
            content={content}
            node={node}
            isOutliner={isOutliner}
            onChange={async (value, editor) => {
              // console.log('editor content change.....', value)

              // if (saving) return
              // setSaving(true)
              await debouncedSaveNodes(value)
              // setSaving(false)
            }}
          ></NodeEditor>
        </div>
      </div>
    </NodeProvider>
  )
}
