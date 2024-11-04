import { useState } from 'react'
import { findNode, findNodePath } from '@/lib/editor-queries'
import { ElementProps } from '@/lib/extension-typings'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MeasuringConfiguration,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'

import { Transforms } from 'slate'
import { useSlateStatic } from 'slate-react'
import { useActiveElement } from '../../activeElement.store'
import { TableElement } from '../../types'
import { AddColumnBar } from './AddColumnBar'
import { AddRowBar } from './AddRowBar'
import { DraglineList } from './DraglineList'
import { TableOptions } from './TableOptions'

const measuring: MeasuringConfiguration = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
}

export const Table = ({
  attributes,
  element,
  children,
}: ElementProps<TableElement>) => {
  const editor = useSlateStatic()
  const { activeId, setActiveId } = useActiveElement()
  const [items, setItems] = useState<string[]>(
    () => element.children.map((child) => child.id) as string[],
  )
  const activeIndex = activeId ? items.indexOf(activeId) : -1
  const tablePath = findNodePath(editor, element)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as any)
  }

  function handleDragCancel() {
    setActiveId(null)
  }

  function handleDragEnd({ over }: DragEndEvent) {
    console.log('over:', over)

    if (over && activeId !== over.id) {
      const overNodeEntry = findNode(editor, {
        at: tablePath,
        match: (n: any) => n.id === over.id,
      })!

      if (!overNodeEntry) return

      const overIndex = items.indexOf(over.id as any)
      const newIndex = overIndex

      setItems((items) => arrayMove(items, activeIndex, newIndex))

      Transforms.moveNodes(editor, {
        at: tablePath,
        to: overNodeEntry[1],
        match: (n: any) => n.id === activeId,
      })
    }
    setActiveId(null)
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      sensors={sensors}
      collisionDetection={closestCenter}
      // modifiers={[restrictToVerticalAxis]}
      measuring={measuring}
    >
      <SortableContext items={items}>
        <div className="flex-1 mb-8 mt-8">
          <div className="relative inline-block">
            <DraglineList element={element} />
            <TableOptions element={element} />
            <table
              id={`table-${element.id}`}
              className="relative border border-collapse"
            >
              <tbody
                className="relative"
                {...attributes}
                // css={{
                //   'tr:first-child': {
                //     '.tableCellHandler': {
                //       display: 'block',
                //     },
                //   },
                // }}
              >
                {children}
              </tbody>
            </table>
            <AddColumnBar element={element} />
            <AddRowBar element={element} />
          </div>
        </div>
      </SortableContext>
      <DragOverlay>
        {activeId ? (
          <div className="py-2 px-3 shadow rounded text-foreground bg-brand-500 inline-block">
            Moving Row {activeIndex + 1}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
