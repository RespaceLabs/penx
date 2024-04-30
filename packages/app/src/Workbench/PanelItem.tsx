import { useState } from 'react'
import { Box, css, styled } from '@fower/react'
import {
  AnimatePresence,
  HTMLMotionProps,
  motion,
  Variant,
} from 'framer-motion'
import { useAtomValue } from 'jotai'
import { X } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'
import { Button, fadeConfig } from 'uikit'
import { WORKBENCH_NAV_HEIGHT } from '@penx/constants'
import { TagDrawer } from '@penx/database'
import { NodeEditor } from '@penx/editor'
import { isAstChange } from '@penx/editor-queries'
import { useActiveSpace, useQuickAdd } from '@penx/hooks'
import { Node } from '@penx/model'
import { NodeProvider, useNodes } from '@penx/node-hooks'
import { nodeToSlate } from '@penx/serializer'
import { NodeService } from '@penx/service'
import { routerAtom, store } from '@penx/store'
import { withAutoNodeId } from '../plugins/withAutoNodeId'
import { withBulletPlugin } from '../plugins/withBulletPlugin'
import { BulletDrawer } from './BulletDrawer/BulletDrawer'
import { LinkedReferences } from './LinkedReferences'
import { QuickAdd } from './QuickAdd/QuickAdd'

const AnimatedDiv = styled(motion.div)

interface Props {
  index: number
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

export function PanelItem({ node, index }: Props) {
  const { nodes, nodeList } = useNodes()
  const nodeService = new NodeService(node, nodes)
  const { activeSpace } = useActiveSpace()

  const [saving, setSaving] = useState(false)

  const isOutliner = activeSpace.isOutliner || node.isListItem

  const content = nodeToSlate({
    node: node.raw,
    nodes: nodeList.rawNodes,
    isOutliner,
    isOutlinerSpace: activeSpace.isOutliner,
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

  const { isOpen, setIsOpen } = useQuickAdd()

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
              <BulletDrawer />
            </NodeEditor>
            <LinkedReferences node={node} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
