import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import isEqual from 'react-fast-compare'
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
import { Transforms } from 'slate'
import { getProjection, UniqueIdentifier } from '@penx/dnd-projection'
import { clearEditor } from '@penx/editor-transforms'
import { useDatabase, useNodes } from '@penx/hooks'
import { db } from '@penx/local-db'
import { Node } from '@penx/model'
import { INode } from '@penx/model-types'
import { nodeToSlate } from '@penx/serializer'
import { NodeCleaner, NodeListService, NodeService } from '@penx/service'
import { store } from '@penx/store'
import { SortableTreeItem } from './SortableTreeItem'
import { TreeItem } from './TreeItem'
import { TreeViewHeader } from './TreeViewHeader'
import { FlattenedItem, TreeItems } from './types'
import {
  buildTree,
  flattenTree,
  removeChildrenOf,
  setProperty,
} from './utilities'

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

const indentationWidth = 50

export const TreeView = ({ nodeList }: TreeViewProps) => {
  // console.log('=============nodeList:', nodeList)

  const items = nodeList.createTree(nodeList.rootNode)

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null)
  const [offsetLeft, setOffsetLeft] = useState(0)

  const flattenedItems = useMemo(() => {
    const flattenedTree = flattenTree(items)
    const foldedItems = flattenedTree.reduce<string[]>(
      (acc, { children, folded, id }) =>
        folded && children.length ? [...acc, id] : acc,
      [],
    )

    return removeChildrenOf(flattenedTree, foldedItems)
  }, [items])

  const projected =
    activeId && overId
      ? getProjection(
          flattenedItems as any,
          activeId,
          overId,
          offsetLeft,
          indentationWidth,
        )
      : null

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
        delay: 200,
        tolerance: 0,
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
    <Box mt3 overflowXHidden>
      <TreeViewHeader />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        measuring={measuring}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext
          items={flattenedItems}
          // strategy={verticalListSortingStrategy}
          strategy={rectSortingStrategy}
        >
          {flattenedItems.map((item) => {
            const overDepth =
              item.id === overId && projected ? projected.depth : item.depth

            return (
              <SortableTreeItem
                key={item.id}
                item={item}
                depth={item.depth}
                overDepth={overDepth}
                onCollapse={async () => {
                  if (item.children.length) {
                    handleFolded(item.id)
                  }
                }}
              />
            )
          })}

          {createPortal(
            <DragOverlay
              // adjustScale={false}
              dropAnimation={dropAnimationConfig}
            >
              {activeId && activeItem ? (
                <TreeItem
                  item={activeItem}
                  depth={activeItem.depth}
                  opacity-40
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
    if (projected && over) {
      // console.log('projected:', projected)

      const activeId = active.id as string
      const overId = over.id as string

      const isOverChildren = checkIsOverChildren(activeId, overId)
      // console.log('isOverChildren=======:', isOverChildren)
      if (isOverChildren) return

      const activeNode = findNode(activeId)

      const isOverSame =
        activeId === overId && activeNode.depth === projected.depth
      // is over same no need to move
      if (isOverSame) return

      const { depth, parentId } = projected

      const clonedItems: FlattenedItem[] = JSON.parse(
        JSON.stringify(flattenTree(items)),
      )
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id)
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id)

      const activeTreeItem = clonedItems[activeIndex]

      clonedItems[activeIndex] = {
        ...activeTreeItem,
        depth,
        parentId: parentId as any,
      }

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex)
      const newItems = buildTree(sortedItems)

      await updateItemsState(newItems)
    }
  }

  function handleDragCancel() {
    resetState()
  }

  async function handleFolded(id: UniqueIdentifier) {
    const newItems = setProperty(items, id, 'folded', (value) => {
      return !value
    })

    await updateItemsState(newItems, false)
  }

  function resetState() {
    setActiveId(null)
    setOverId(null)
    setOffsetLeft(0)
    document.body.style.setProperty('cursor', '')
  }

  function checkIsOverChildren(activeId: string, overId: string) {
    const activeNode = nodeList.getNode(activeId)
    const overNode = nodeList.getNode(overId)
    const childrenNodes = nodeList.flattenNode(activeNode)
    const find = childrenNodes.find(({ id }) => id === overNode.id)
    return !!find
  }

  /**
   * find node in flattenedItems
   * @param nodeId
   * @returns
   */
  function findNode(nodeId: string) {
    return flattenedItems.find(({ id }) => id === nodeId)!
  }

  async function updateItemsState(
    newItems: TreeItems,
    reloadNode: boolean = true,
  ) {
    updateToStore(newItems, reloadNode)

    await updateToDB(newItems)

    // reload the editor
    if (reloadNode) {
      const nodes = await db.listNodesBySpaceId(newItems[0].spaceId)
      const editor = store.editor.getEditor(0)
      clearEditor(editor)

      const [activeNode] = store.node.getActiveNodes()

      const newActiveNode = nodes.find(({ id }) => id === activeNode.id)!

      store.node.setFirstActiveNodes(newActiveNode)

      const value = nodeToSlate(newActiveNode, nodes)

      Transforms.insertNodes(editor, value)
    }
  }

  async function updateToStore(newItems: TreeItems, reloadNode = true) {
    const items = flattenTree(newItems)
    const newNodes = nodeList.nodes.map<INode>((node) => {
      if (node.isRootNode) {
        const children = items
          .filter((item) => !item.parentId)
          .map((item) => item.id)
        return {
          ...node.raw,
          children,
        }
      }

      const item = items.find(({ id }) => id === node.id)!

      if (!item) return { ...node.raw }

      const parentId = item.parentId || nodeList.rootNode.id
      const children = item.children.map((child) => child.id)

      return {
        ...node.raw,
        folded: item.folded,
        parentId,
        children,
      }
    })

    store.node.setNodes(newNodes)
  }

  async function updateToDB(newItems: TreeItems) {
    const items = flattenTree(newItems)

    for (const item of items) {
      const parentId = item.parentId || nodeList.rootNode.id
      const children = item.children.map((child) => child.id)
      const node = nodeList.getNode(item.id)
      if (
        isEqual(parentId, node.parentId) &&
        isEqual(item.folded, node.folded) &&
        isEqual(children, node.children)
      ) {
        continue
      }

      await db.updateNode(item.id, {
        folded: item.folded,
        parentId,
        children,
      })
    }

    const rootNodeChildren = items
      .filter((item) => !item.parentId)
      .map((item) => item.id)

    await db.updateNode(nodeList.rootNode.id, {
      children: rootNodeChildren,
    })

    await new NodeCleaner().cleanDeletedNodes()
  }
}
