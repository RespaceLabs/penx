import { useState } from 'react'
import { Box } from '@fower/react'
import { useAtomValue } from 'jotai'
import { useDebouncedCallback } from 'use-debounce'
import { NodeEditor } from '@penx/editor'
import { isAstChange } from '@penx/editor-queries'
import { NodeProvider, useNodes } from '@penx/hooks'
import { db } from '@penx/local-db'
import { Node } from '@penx/model'
import { nodeToSlate, slateToNodes } from '@penx/serializer'
import { diffNodes, NodeListService, NodeService } from '@penx/service'
import { routerAtom, store } from '@penx/store'
import { trpc } from '@penx/trpc-client'
import { withBulletPlugin } from '../plugins/withBulletPlugin'
import { MobileNav } from './DocNav/MobileNav'
import { PCNav } from './DocNav/PCNav'
import { LinkedReferences } from './LinkedReferences'

interface Props {
  index: number
  node: Node
}

export function PanelItem({ node, index }: Props) {
  const { nodes, nodeList } = useNodes()
  const { name } = useAtomValue(routerAtom)
  const nodeService = new NodeService(node, nodes)

  const [saving, setSaving] = useState(false)

  const content = nodeToSlate(node.raw, nodeList.rawNodes)

  const debouncedSaveNodes = useDebouncedCallback(async (value: any[]) => {
    const oldNodes = nodeList.flattenNode(node).map((node) => node.raw)

    await nodeService.savePage(node.raw, value[0], value[1])

    /**
     * sync to cloud
     */
    const activeSpace = store.getActiveSpace()
    if (!activeSpace.isCloud) return

    // TODO: need to improve
    const newNode = await db.getNode(node.id)
    const nodes = await db.listNodesBySpaceId(node.spaceId)
    const nodeListService = new NodeListService(nodes)
    const newNodes = nodeListService
      .flattenNode(new Node(newNode))
      .map((node) => node.raw)

    const diffed = diffNodes([node.raw, ...oldNodes], [newNode, ...newNodes])

    console.log('====diffed:', diffed)

    const newVersion = await trpc.node.sync.mutate({
      version: activeSpace.version,
      spaceId: node.spaceId,
      added: JSON.stringify(diffed.added),
      updated: JSON.stringify(diffed.updated),
      deleted: JSON.stringify(diffed.deleted.map((n) => n.id)),
    })

    console.log('=========newVersion:', newVersion)

    await store.updateSpace(activeSpace.id, { version: newVersion })
  }, 1000)

  // console.log('====content:', index, content)

  return (
    <NodeProvider value={{ index, node, nodeService }}>
      <Box relative h-100vh flex-1 borderRight>
        <Box
          overflowYAuto
          h={['calc(100vh - 48px)', '100vh']}
          px={[10, 16, 30, 40, 0]}
          py0
        >
          <MobileNav />
          {name === 'NODE' && <PCNav />}
          <Box w-100p>
            <Box mx-auto maxW-800>
              <NodeEditor
                index={index}
                plugins={[withBulletPlugin]}
                content={content}
                node={node}
                onChange={async (value, editor) => {
                  if (isAstChange(editor)) {
                    if (saving) return
                    setSaving(true)
                    await debouncedSaveNodes(value)
                    setSaving(false)
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
