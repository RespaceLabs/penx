import { useState } from 'react'
import { Box } from '@fower/react'
import { useAtomValue } from 'jotai'
import { useDebouncedCallback } from 'use-debounce'
import { WORKBENCH_NAV_HEIGHT } from '@penx/constants'
import { TagDrawer } from '@penx/database'
import { NodeEditor } from '@penx/editor'
import { isAstChange } from '@penx/editor-queries'
import { useActiveSpace } from '@penx/hooks'
import { Node } from '@penx/model'
import { NodeProvider, useNodes } from '@penx/node-hooks'
import { nodeToSlate } from '@penx/serializer'
import { NodeService } from '@penx/service'
import { routerAtom, store } from '@penx/store'
import { withAutoNodeId } from '../plugins/withAutoNodeId'
import { withBulletPlugin } from '../plugins/withBulletPlugin'
import { LinkedReferences } from './LinkedReferences'

interface Props {
  index: number
  node: Node
}

export function PanelItem({ node, index }: Props) {
  const { nodes, nodeList } = useNodes()
  const { name } = useAtomValue(routerAtom)
  const nodeService = new NodeService(node, nodes)
  const { activeSpace } = useActiveSpace()

  const [saving, setSaving] = useState(false)

  const isOutliner = activeSpace.isOutliner || node.isListItem

  const content = nodeToSlate(
    node.raw,
    nodeList.rawNodes,
    isOutliner,
    activeSpace.isOutliner,
  )

  const debouncedSaveNodes = useDebouncedCallback(async (value: any[]) => {
    if (isOutliner) {
      await nodeService.saveOutlinerEditor(node.raw, value[0], value[1])
    } else {
      await nodeService.saveBlockEditor(node.raw, value)
    }
  }, 300)

  const w = node.isDatabase ? '100%' : 800

  const plugins = [withBulletPlugin]

  if (!activeSpace.isOutliner) {
    plugins.push(withAutoNodeId)
  }

  return (
    <Box relative h-100vh flex-1 px={[6, 6, 0]} pt={[8, 8, 0]}>
      <Box
        overflowYAuto
        h={[`calc(100vh - ${WORKBENCH_NAV_HEIGHT}px)`, '100vh']}
        pl={[0, 16]}
        pr={[0, 4]}
        pt0
        pb-100
      >
        <Box w-100p>
          <Box
            mx-auto
            maxW={w}
            mt={[0, 0, 32]}
            style={{
              wordBreak: 'break-word',
            }}
          >
            <NodeEditor
              index={index}
              plugins={plugins}
              // content={[content[1]]}
              content={content}
              node={node}
              isOutliner={isOutliner}
              onChange={async (value, editor) => {
                if (isAstChange(editor)) {
                  // if (saving) return
                  // setSaving(true)
                  await debouncedSaveNodes(value)
                  // setSaving(false)
                }
              }}
            >
              <TagDrawer />
            </NodeEditor>
            <LinkedReferences node={node} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
