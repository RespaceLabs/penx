import { useState } from 'react'
import { TagDrawer } from '@/editor-extensions/database'
import { WORKBENCH_NAV_HEIGHT } from '@/lib/constants'
import { NodeEditor } from '@/lib/editor'
import { isAstChange } from '@/lib/editor-queries'
import { Node } from '@/lib/model'
import { NodeProvider, useNodes } from '@/lib/node-hooks'
import { nodeToSlate } from '@/lib/serializer'
import { NodeService } from '@/lib/service'
import {
  AnimatePresence,
  HTMLMotionProps,
  motion,
  Variant,
} from 'framer-motion'
import { useAtomValue } from 'jotai'
import { X } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'
import { BulletDrawer } from './BulletDrawer/BulletDrawer'
import { withAutoNodeId } from './plugins/withAutoNodeId'
import { withBulletPlugin } from './plugins/withBulletPlugin'

interface Props {
  node: Node
}

type MotionVariants<T extends string> = Record<T, Variant>
type ScaleMotionVariant = MotionVariants<'enter' | 'exit'>

const variants: ScaleMotionVariant = {
  exit: {
    // opacity: 0,
    // scale: 0.1,
    height: 0,
    transition: {
      duration: 1,
      easings: 'easeout',
    },
  },
  enter: {
    // opacity: 1,
    // scale: 1,
    height: '200px',
    transition: {
      duration: 1,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

export function PanelItem({ node }: Props) {
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

  // console.log('===========node.raw', node.raw, 'content:', content)

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
    <div className="relative h-screen flex-1 px-2 md:px-0 py-2 md:py-0">
      <div className="overflow-auto pb-20">
        <div
          className="w-full"
          style={{
            wordBreak: 'break-word',
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
    </div>
  )
}
