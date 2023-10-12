import {
  FocusEvent,
  KeyboardEvent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react'
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
import { Descendant, Editor, Element, Transforms } from 'slate'
import { Editable, ReactEditor, RenderElementProps, Slate } from 'slate-react'
import { EditableProps } from 'slate-react/dist/components/editable'
import { onKeyDownAutoformat } from '@penx/autoformat'
import { SetNodeToDecorations } from '@penx/code-block'
import { Leaf } from '@penx/editor-leaf'
import { useExtensionStore } from '@penx/hooks'
import { useCreateEditor } from '../hooks/useCreateEditor'
import { useDecorate } from '../hooks/useDecorate'
import { useOnCompositionEvent } from '../hooks/useOnCompositionEvent'
import { useOnDOMBeforeInput } from '../hooks/useOnDOMBeforeInput'
import ClickablePadding from './ClickablePadding'
import { DragOverlayContent } from './DragOverlayContent'
import { ElementContent } from './ElementContent'
import HoveringToolbar from './HoveringToolbar/HoveringToolbar'
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
  onChange?: (value: Descendant[], editor: Editor) => void
}

export function DocEditor({ content, onChange, renderPrefix }: Props) {
  const editor = useCreateEditor()
  const { extensionStore } = useExtensionStore()

  const decorate = useDecorate(editor)
  const onDOMBeforeInput = useOnDOMBeforeInput(editor)
  const onOnCompositionEvent = useOnCompositionEvent(editor)

  const [activeId, setActiveId] = useState<string | null>(null)
  const activeElement = editor.children.find((x: any) => x.id === activeId)

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
    const overIndex = editor.children.findIndex((x: any) => x.id === overId)

    if (overId !== activeId && overIndex !== -1) {
      Transforms.moveNodes(editor, {
        at: [],
        match: (node: any) => node.id === activeId,
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
      const element = props.element as Element
      const isTopLevel =
        ReactEditor.findPath(editor as any, element as any).length === 1

      const attr = {
        ...props.attributes,
        // 'data-slate-type': element.type,
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
    () => editor.children.map((element: any) => element.id!),
    [editor.children],
  )

  const keyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // form auto format
    onKeyDownAutoformat(
      editor as any,
      {
        options: { rules: extensionStore.rules },
      } as any,
    )(e)

    for (const fn of (editor as any).onKeyDownFns) {
      fn(editor, e)
    }
  }

  const blur = (e: FocusEvent<HTMLDivElement, globalThis.Element>) => {
    for (const fn of (editor as any).onBlurFns) {
      fn(editor, e)
    }
  }

  return (
    <Slate
      editor={editor as any}
      initialValue={content}
      onChange={(value) => {
        onChange?.(value, editor)
      }}
    >
      {renderPrefix?.(editor)}
      <HoveringToolbar />

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
            onKeyDown={keyDown}
            onDOMBeforeInput={onDOMBeforeInput}
            onBlur={blur}
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
