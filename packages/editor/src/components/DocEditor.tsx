import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MeasuringConfiguration,
  MeasuringStrategy,
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { css } from '@fower/react'
import { Descendant, Editor, Transforms } from 'slate'
import { withListsReact } from 'slate-lists'
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  Slate,
  useSlate,
} from 'slate-react'
import { EditableProps } from 'slate-react/dist/components/editable'
import { getCurrentNode } from '@penx/editor-queries'
import { EditorPlugin } from '@penx/editor-types'
import { useCreateEditor } from '../hooks/useCreateEditor'
import { useDecorate } from '../hooks/useDecorate'
import { useOnCompositionEvent } from '../hooks/useOnCompositionEvent'
import { useOnDOMBeforeInput } from '../hooks/useOnDOMBeforeInput'
import { useOnKeyDown } from '../hooks/useOnKeyDown'
import { FrontMatterHintPopover } from '../plugins/front-matter/ui/FrontMatterHintPopover'
import ClickablePadding from './ClickablePadding'
import { DragOverlayContent } from './DragOverlayContent'
import { ElementContent } from './ElementContent'
import HoveringToolbar from './HoveringToolbar/HoveringToolbar'
import { Leaf } from './Leaf'
import { SetNodeToDecorations } from './SetNodeToDecorations'
import { SortableElement } from './SortableElement'

const measuring: MeasuringConfiguration = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
}

interface Props {
  content: any[]
  renderPrefix?: (editor: Editor) => ReactNode
  editableProps?: EditableProps
  plugins?: EditorPlugin[]
  onChange?: (value: Descendant[], editor: Editor) => void
}

export function DocEditor({ content, plugins, onChange, renderPrefix }: Props) {
  const editor = withListsReact(useCreateEditor(plugins))

  const onKeyDown = useOnKeyDown(editor)
  const decorate = useDecorate(editor)
  const onDOMBeforeInput = useOnDOMBeforeInput(editor)
  const onOnCompositionEvent = useOnCompositionEvent(editor)

  const [activeId, setActiveId] = useState<string | null>(null)
  const activeElement = editor.children.find((x) => x.id === activeId)

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragStart = ({ active }: DragStartEvent) => {
    if (active) {
      setActiveId(active.id as string)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const overId = event.over?.id
    const overIndex = editor.children.findIndex((x) => x.id === overId)

    if (overId !== activeId && overIndex !== -1) {
      Transforms.moveNodes(editor, {
        at: [],
        match: (node) => node.id === activeId,
        to: [overIndex],
      })
    }

    setActiveId(null)
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  const renderElement = useCallback(
    (props: RenderElementProps) => {
      const { element } = props
      const isTopLevel =
        ReactEditor.findPath(editor, props.element).length === 1

      const attr = {
        ...props.attributes,
        'data-slate-type': element.type,
      }

      return isTopLevel ? (
        <SortableElement
          {...props}
          renderElement={(p) => {
            return <ElementContent {...p} attributes={attr} />
          }}
        />
      ) : (
        <ElementContent {...props} attributes={attr} />
      )
    },
    [editor],
  )

  const items: string[] = useMemo(
    () => editor.children.map((element) => element.id!),
    [editor.children],
  )

  const node = getCurrentNode(editor)

  return (
    <Slate
      editor={editor}
      initialValue={content}
      onChange={(value) => {
        onChange?.(value, editor)
      }}
    >
      {renderPrefix?.(editor)}
      <HoveringToolbar />

      {node && <FrontMatterHintPopover />}

      <SetNodeToDecorations />
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        sensors={sensors}
        collisionDetection={closestCenter}
        measuring={measuring}
      >
        <SortableContext items={items} strategy={rectSortingStrategy}>
          <Editable
            className={css('black mt4 outlineNone')}
            renderLeaf={(props) => <Leaf {...props} />}
            renderElement={renderElement}
            decorate={decorate as any} //
            onCompositionUpdate={onOnCompositionEvent}
            onCompositionEnd={onOnCompositionEvent}
            onKeyDown={onKeyDown}
            onDOMBeforeInput={onDOMBeforeInput}
          />
        </SortableContext>
        <ClickablePadding />
        {createPortal(
          <DragOverlay adjustScale={false}>
            {activeElement && (
              <DragOverlayContent element={activeElement as any} />
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </Slate>
  )
}
