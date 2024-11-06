import { useState } from 'react'
import { TagDrawer } from '@/editor-extensions/database'
import { WORKBENCH_NAV_HEIGHT } from '@/lib/constants'
import { NodeEditor } from '@/lib/editor'
import { isAstChange } from '@/lib/editor-queries'
import { Node } from '@/lib/model'
import { NodeProvider, useNodes } from '@/lib/node-hooks'
import { nodeToSlate } from '@/lib/serializer'
import { NodeService } from '@/lib/service'
import { useDebouncedCallback } from 'use-debounce'
import { BulletDrawer } from './BulletDrawer/BulletDrawer'
import { PCNav } from './NodeNav/PCNav'
import { withAutoNodeId } from './plugins/withAutoNodeId'
import { withBulletPlugin } from './plugins/withBulletPlugin'

interface Props {
  node: Node
}

export function NodeEditorApp({ node }: Props) {
  const { nodes, nodeList } = useNodes()
  const nodeService = new NodeService(node, nodes)

  const [saving, setSaving] = useState(false)

  const isOutliner = false

  const content = nodeToSlate({
    node: node.raw,
    nodes: nodeList.rawNodes,
    isOutliner,
    isOutlinerSpace: false,
  })

  const debouncedSaveNodes = useDebouncedCallback(async (value: any[]) => {
    if (isOutliner) {
      await nodeService.saveOutlinerEditor(node.raw, value[0], value[1])
    } else {
      await nodeService.saveBlockEditor(node.raw, value)
    }
  }, 300)

  const w = node.isDatabase ? '100%' : 800

  const plugins = [withBulletPlugin]

  plugins.push(withAutoNodeId)

  return (
    <NodeProvider value={{ node }}>
      <div className="relative h-screen flex-1 px-2 md:px-0 py-2 md:py-0">
        <PCNav></PCNav>
        <div
          className="mx-auto md:max-w-2xl pt-14 pl-0 sm:pl-4 pr-0 sm:pr-1 break-words pb-20"
          style={{
            minHeight: `calc(100vh - ${WORKBENCH_NAV_HEIGHT}px)`,
          }}
        >
          <NodeEditor
            plugins={plugins}
            // content={[content[1]]}
            content={content}
            node={node}
            isOutliner={isOutliner}
            onChange={async (value, editor) => {
              if (isAstChange(editor)) {
                console.log('editor content change.....', value)

                // if (saving) return
                // setSaving(true)
                await debouncedSaveNodes(value)
                // setSaving(false)
              }
            }}
          >
            <TagDrawer />
            <BulletDrawer />
          </NodeEditor>
        </div>
      </div>
    </NodeProvider>
  )
}

export default NodeEditorApp
