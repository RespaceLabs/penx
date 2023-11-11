import { useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  closestCenter,
  defaultDropAnimation,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  KeyboardSensor,
  MeasuringStrategy,
  Modifier,
  PointerSensor,
  SensorContext,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Box } from '@fower/react'
import { useNodes } from '@penx/hooks'
import { db } from '@penx/local-db'
import { NodeCleaner, NodeListService } from '@penx/service'
import { store } from '@penx/store'
import { SortableTreeItem } from './SortableTreeItem'
import { TreeItem } from './TreeItem'
import { getProjection, UniqueIdentifier } from './utils'

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
}

const dropAnimationConfig: DropAnimation = {
  keyframes({ transform }) {
    return [
      { opacity: 1, transform: CSS.Transform.toString(transform.initial) },
      {
        opacity: 0,
        transform: CSS.Transform.toString({
          ...transform.final,
          x: transform.final.x + 5,
          y: transform.final.y + 5,
        }),
      },
    ]
  },
  easing: 'ease-out',
  sideEffects({ active }) {
    active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: defaultDropAnimation.duration,
      easing: defaultDropAnimation.easing,
    })
  },
}

interface TreeViewProps {
  nodeList: NodeListService
}

export const TreeView = ({ nodeList }: TreeViewProps) => {
  const indentationWidth = 50

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null)
  const [offsetLeft, setOffsetLeft] = useState(0)

  const flattenedItems = useMemo(() => {
    return nodeList.flattenNode(nodeList.rootNode)
  }, [nodeList])

  const projected =
    activeId && overId
      ? getProjection(
          flattenedItems,
          activeId,
          overId,
          offsetLeft,
          indentationWidth,
        )
      : null

  const renderNodes = (children: string[], level = 0) => {
    return children.map((child, i) => {
      const node = flattenedItems.find(({ id }) => id === child)!
      // const node = nodeList.getNode(child)

      const depth = level
      const overDepth = child === overId && projected ? projected.depth : level

      if (!node.children.length) {
        return (
          <SortableTreeItem
            key={child}
            node={node}
            level={depth}
            overDepth={overDepth}
          />
        )
      }

      return (
        <Box key={child}>
          <SortableTreeItem
            key={child}
            node={node}
            level={depth}
            overDepth={overDepth}
          />
          <Box>{renderNodes(node.children, level + 1)}</Box>
        </Box>
      )
    })
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      // coordinateGetter,
    }),
  )

  const activeItem = activeId
    ? flattenedItems.find(({ id }) => id === activeId)
    : null

  return (
    <Box px3>
      <Box mb2 fontBold>
        Tree view
      </Box>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        measuring={measuring}
        onDragMove={handleDragMove}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext
          items={flattenedItems}
          // strategy={verticalListSortingStrategy}
          strategy={rectSortingStrategy}
        >
          <Box>{renderNodes(nodeList.rootNode?.children || [])}</Box>

          {createPortal(
            <DragOverlay
              // adjustScale={false}
              dropAnimation={dropAnimationConfig}
            >
              {activeId && activeItem ? (
                <TreeItem
                  node={activeItem}
                  level={activeItem.depth}
                  opacity-80
                />
              ) : null}
            </DragOverlay>,
            document.body,
          )}
        </SortableContext>
      </DndContext>
    </Box>
  )

  function handleDragStart({ active: { id: activeId } }: DragStartEvent) {
    setActiveId(activeId as string)
    setOverId(activeId as string)

    document.body.style.setProperty('cursor', 'grabbing')
  }
  function handleDragMove({ delta }: DragMoveEvent) {
    setOffsetLeft(delta.x)
  }

  function handleDragOver({ over }: DragOverEvent) {
    setOverId((over?.id as any) ?? null)
  }

  async function handleDragEnd({ active, over }: DragEndEvent) {
    resetState()

    const activeId = active.id as string
    const overId = over?.id as string

    if (!(overId && projected)) return
    const { depth, parentId } = projected

    console.log('gogo........: ', depth, 'parentId:', parentId)

    if (!parentId) {
      if (activeId !== overId) {
        const { children } = nodeList.rootNode
        const activeIndex = children.findIndex((id) => id === activeId)
        const overIndex = children.findIndex((id) => id === overId)

        nodeList.rootNode.raw.children = arrayMove(
          children,
          activeIndex,
          overIndex,
        )

        updateStore()

        // save to db async
        await db.updateNode(nodeList.rootNode.id, {
          children: nodeList.rootNode.children,
        })

        await new NodeCleaner().cleanDeletedNodes()
      } else {
        // nothing to do
      }
    } else {
      if (activeId === overId) {
        // console.log('same ...222222222222')
        // TODO..
        // return
      }

      /**
       * has parentId
       */
      const activeNode = nodeList.getNode(activeId)
      const overNode = nodeList.getNode(overId)
      const targetParentNode = nodeList.getNode(parentId)
      const originalParentNode = nodeList.getNode(activeNode.parentId)

      // remove from original parent node
      originalParentNode.raw.children = originalParentNode.raw.children.filter(
        (id) => id !== activeId,
      )

      // insert into target parent node
      const overIndex = targetParentNode.raw.children.findIndex(
        (i) => i === overId,
      )
      targetParentNode.raw.children.splice(overIndex, 0, activeId)

      // update active node parentID
      activeNode.raw.parentId = targetParentNode.id

      // console.log(
      //   'targetParentNode.id:',
      //   targetParentNode.id,
      //   'activeNode:',
      //   activeNode,
      // )

      updateStore()

      /**
       * save to db async
       */
      await Promise.all([
        db.updateNode(originalParentNode.id, {
          children: originalParentNode.raw.children,
        }),

        db.updateNode(targetParentNode.id, {
          children: targetParentNode.raw.children,
        }),

        db.updateNode(activeNode.id, {
          parentId: activeNode.raw.parentId,
        }),
      ])
      console.log('activeNode.parentId,:', activeNode.parentId)

      await new NodeCleaner().cleanDeletedNodes()
    }
  }

  function updateStore() {
    const newNodes = nodeList.nodes.map((n) => n.raw)
    store.setNodes(newNodes)
    const activeNode = store.getNode()
    const newActiveNode = newNodes.find((n) => n.id === activeNode.id)
    if (newActiveNode) store.reloadNode(newActiveNode)
  }

  function handleDragCancel() {
    resetState()
  }

  function resetState() {
    setActiveId(null)
    setOverId(null)
    setOffsetLeft(0)
    document.body.style.setProperty('cursor', '')
  }
}
