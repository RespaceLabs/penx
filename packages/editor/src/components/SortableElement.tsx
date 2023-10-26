import { useMemo } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Box } from '@fower/react'
import { RenderElementProps, useSlate, useSlateStatic } from 'slate-react'
import { findNodePath } from '@penx/editor-queries'
import { ElementMenu } from './ElementMenu/ElementMenu'

interface Props extends RenderElementProps {
  renderElement: (props: RenderElementProps) => any
}

export const SortableElement = (props: Props) => {
  const { attributes, element, children, renderElement } = props
  const { id = '' } = element as any
  const editor = useSlateStatic()
  const at = findNodePath(editor, element)!

  const sortable = useSortable({ id })

  const { over, active } = sortable

  const items = useMemo(
    () => editor.children.map((n: any) => n.id),
    [editor.children],
  )

  function getActiveStyle() {
    if (!over || !active) return {}
    if (id !== over.id) return {}
    if (over.id === active.id) return {}
    const activeIndex = items.indexOf(active.id! as string)
    const overIndex = items.indexOf(over?.id)

    const isAfter = overIndex > activeIndex
    const style = {
      left: 0,
      right: 0,
      top0: !isAfter,
      bottom0: isAfter,
      content: '""',
      position: 'absolute',
      h: 2,
      w: '100%',
      bgBlue500: true,
    }
    return {
      '::after': style,
    }
  }

  const { isSorting, isDragging, transition, setNodeRef, transform } = sortable

  return (
    <Box
      ref={setNodeRef}
      className="editorElement"
      relative
      style={{
        transition: transition,
        // transform: CSS.Translate.toString(sortable.transform),
        transform: isSorting ? undefined : CSS.Translate.toString(transform!),
      }}
      css={getActiveStyle()}
    >
      {/* <ElementMenu element={element} path={at} listeners={sortable.listeners} /> */}
      {renderElement({ attributes, element, children })}
    </Box>
  )
}
