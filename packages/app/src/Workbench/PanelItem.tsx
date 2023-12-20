import { useState } from 'react'
import { Box } from '@fower/react'
import { useAtomValue } from 'jotai'
import { useDebouncedCallback } from 'use-debounce'
import { Button } from 'uikit'
import { NodeEditor } from '@penx/editor'
import { isAstChange } from '@penx/editor-queries'
import { NodeProvider, useNodes } from '@penx/hooks'
import { db } from '@penx/local-db'
import { Node } from '@penx/model'
import {
  IColumnNode,
  IDatabaseNode,
  IViewNode,
  NodeType,
} from '@penx/model-types'
import { nodeToSlate } from '@penx/serializer'
import { NodeService } from '@penx/service'
import { routerAtom, store } from '@penx/store'
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

  // console.log('--------=======node:', node)

  const [saving, setSaving] = useState(false)

  const content = nodeToSlate(node.raw, nodeList.rawNodes)

  const debouncedSaveNodes = useDebouncedCallback(async (value: any[]) => {
    await nodeService.savePage(node.raw, value[0], value[1])
  }, 400)

  const w = node.isDatabase ? '100%' : 800

  // return (
  //   <Button
  //     mt2
  //     ml2
  //     size="sm"
  //     onClick={async () => {
  //       const activeSpace = store.space.getActiveSpace()

  //       const views = (await db.node.select({
  //         where: {
  //           type: NodeType.VIEW,
  //           spaceId: activeSpace.id,
  //           databaseId: node.id,
  //         },
  //       })) as IViewNode[]

  //       const database = (await db.getNode(node.id)) as IDatabaseNode

  //       await db.updateNode<IDatabaseNode>(node.id, {
  //         props: {
  //           ...database.props,
  //           viewIds: views.map((view) => view.id),
  //         },
  //       })

  //       const columns = (await db.node.select({
  //         where: {
  //           type: NodeType.COLUMN,
  //           spaceId: activeSpace.id,
  //           databaseId: node.id,
  //         },
  //         sortBy: 'createdAt',
  //         orderByDESC: false,
  //       })) as IColumnNode[]

  //       const primaryColumns = columns.filter((c) => c.props.isPrimary)
  //       const notPrimaryColumns = columns.filter((c) => !c.props.isPrimary)

  //       for (const view of views) {
  //         await db.updateView(view.id, {
  //           filters: [],
  //           groups: [],
  //           sorts: [],
  //           viewColumns: [...primaryColumns, ...notPrimaryColumns].map((c) => ({
  //             columnId: c.id,
  //             width: 160,
  //             visible: true,
  //           })),
  //         })
  //       }

  //       console.log('======activeSpace:', node, views)
  //     }}
  //   >
  //     Fix space data
  //   </Button>
  // )

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
                plugins={[withBulletPlugin]}
                // content={[content[1]]}
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
