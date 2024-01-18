import { useState } from 'react'
import { Box } from '@fower/react'
import { useAtomValue } from 'jotai'
import { useDebouncedCallback } from 'use-debounce'
import { Button } from 'uikit'
import { NodeEditor } from '@penx/editor'
import { isAstChange } from '@penx/editor-queries'
import { NodeProvider, useNodes, useSpaces } from '@penx/hooks'
import { db } from '@penx/local-db'
import { Node } from '@penx/model'
import { nodeToSlate } from '@penx/serializer'
import { NodeService } from '@penx/service'
import { routerAtom, store } from '@penx/store'
import { withAutoNodeId } from '../plugins/withAutoNodeId'
import { withBulletPlugin } from '../plugins/withBulletPlugin'
import { LinkedReferences } from './LinkedReferences'
import { PCNav } from './NodeNav/PCNav'

interface Props {
  index: number
  node: Node
}

export function PanelItem({ node, index }: Props) {
  const { nodes, nodeList } = useNodes()
  const { name } = useAtomValue(routerAtom)
  const nodeService = new NodeService(node, nodes)
  const { activeSpace } = useSpaces()

  const [saving, setSaving] = useState(false)

  const isOutliner = activeSpace.isOutliner || node.isListItem

  const content = nodeToSlate(
    node.raw,
    nodeList.rawNodes,
    isOutliner,
    activeSpace.isOutliner,
  )

  // console.log('======content:', content)

  const debouncedSaveNodes = useDebouncedCallback(async (value: any[]) => {
    if (isOutliner) {
      await nodeService.saveOutlinerEditor(node.raw, value[0], value[1])
    } else {
      await nodeService.saveBlockEditor(node.raw, value)
    }
  }, 100)

  const w = node.isDatabase ? '100%' : 800

  const plugins = [withBulletPlugin]

  if (!activeSpace.isOutliner) {
    plugins.push(withAutoNodeId)
  }

  return (
    <NodeProvider value={{ index, node, nodeService }}>
      <Box relative h-100vh flex-1>
        <Box
          overflowYAuto
          h={['calc(100vh - 48px)', '100vh']}
          pl={[0, 16]}
          pr={[0, 4]}
          pt0
          pb-100
        >
          {name === 'NODE' && <PCNav />}
          <Box w-100p>
            <Box
              mx-auto
              maxW={w}
              mt={[0, 0, 32]}
              style={{
                wordBreak: 'break-all',
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
              />
              <LinkedReferences node={node} />
            </Box>
          </Box>
        </Box>
      </Box>
    </NodeProvider>
  )
}
