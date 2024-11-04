import React, { CSSProperties, forwardRef, memo, useMemo } from 'react'
import isEqual from 'react-fast-compare'
import { mergeRefs } from 'react-merge-refs'
import { isCheckListItem } from '@/editor-extensions/check-list'
import { useContextMenu } from '@/lib/context-menu'
import { TElement, useEditorStatic } from '@/lib/editor-common'
import { findNodePath, getNodeByPath } from '@/lib/editor-queries'
import { ElementProps } from '@/lib/extension-typings'
import { NodeType } from '@/lib/model'
import { cn } from '@/lib/utils'
import { useSortable } from '@dnd-kit/sortable'
import { ListContentElement } from '../types'
import { Bullet } from './Bullet'
import { BulletMenu } from './BulletMenu'
import { Chevron } from './Chevron'

interface Props extends ElementProps<ListContentElement> {
  style?: CSSProperties
  css?: any
  listeners?: ReturnType<typeof useSortable>['listeners']
}

export const ListItemContent = memo(
  forwardRef<HTMLDivElement, Props>(function ListItemContent(
    {
      attributes,
      element,
      children,
      nodeProps,
      css = {},
      style = {},
      listeners,
    },
    ref,
  ) {
    const editor = useEditorStatic()
    const path = useMemo(
      () => findNodePath(editor, element)!,
      [element, editor],
    )
    const child = getNodeByPath(editor, [...path, 0]) as TElement
    const isHeading = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(child?.type)

    const nodeType = element.nodeType!
    const isDaily = nodeType === NodeType.DAILY

    function h() {
      // if (isTask) return 'calc(1.5em + 2px)'
      return isHeading ? 'calc(1em)' : 'calc(1.5em + 6px)'
    }

    const nodeId = element.id
    const menuId = `lic-menu-${nodeId}`
    const { show } = useContextMenu(menuId)
    const isTask = isCheckListItem(child)

    const draggable = !isDaily

    const childCount = useMemo(() => {
      if (!isDaily) return 0
      return editor.items.filter((item) => item.date === element.date).length
    }, [isDaily, editor.items, element.date])

    return (
      <>
        <div
          {...attributes}
          ref={mergeRefs([ref, attributes.ref])}
          data-type="list-item-content"
          // leadingNormal
          // leadingRelaxed
          className="nodeContent m-0 text-base relative h-full px-1 py-0"
          {...nodeProps}
          // css={css}
          style={style}
        >
          <div
            contentEditable={false}
            className={cn(
              'absolute w-10 -left-10 flex items-center justify-end gap-2 text-sm',
              child?.type === 'h1' && 'text-3xl',
              child?.type === 'h2' && 'text-2xl',
              child?.type === 'h3' && 'text-xl',
              child?.type === 'h4' && 'text-lg',
            )}
            style={{
              userSelect: 'none',
              height: h(),
            }}
            // bgAmber100
            // ringPurple500
          >
            <BulletMenu
              menuId={menuId}
              path={path}
              nodeType={nodeType}
              id={nodeId}
            />

            <Chevron
              path={path}
              id={nodeId}
              collapsed={element.collapsed}
              onContextMenu={show}
            />

            <div className="inline-flex" {...(draggable ? listeners : {})}>
              <Bullet element={element} onContextMenu={show} editor={editor} />
            </div>
          </div>

          {isDaily && (
            <div className="flex-1 pl-1 leading-relaxed flex items-center gap-2">
              <div>{children}</div>
              {childCount > 0 && (
                <div
                  contentEditable={false}
                  className="bg-foreground/5 text-foreground/40 px-2 h-5 rounded-full text-xs"
                >
                  {childCount}
                </div>
              )}
            </div>
          )}

          {!isDaily && (
            <div
              className="flex-1 pl-1 leading-relaxed"
              // bgGreen100
              // ringAmber500
            >
              {children}
            </div>
          )}
        </div>
      </>
    )
  }),

  (prev, next) => {
    const {
      element: a1,
      css: b1,
      style: c1,
      nodeProps: d1,
      children: f1,
    } = prev
    const {
      element: a2,
      css: b2,
      style: c2,
      nodeProps: d2,
      children: f2,
    } = next

    const equal =
      isEqual(a1, a2) &&
      isEqual(b1, b2) &&
      isEqual(c1, c2) &&
      isEqual(d1, d2) &&
      isEqual(f1, f2)

    return equal
  },
)
