import { useCallback, useEffect, useState } from 'react'
import { useEditor, useEditorStatic } from '@/lib/editor-common'
import {
  findNodePath,
  getCurrentNode,
  getNodeByPath,
} from '@/lib/editor-queries'
import { ElementProps } from '@/lib/extension-typings'
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react'

import { Transforms } from 'slate'
import { TagSelectorElement } from '../../types'
import { TagSelectorContent } from './TagSelectorContent'

export const TagSelector = ({
  element,
  children,
}: ElementProps<TagSelectorElement>) => {
  const editor = useEditor()
  const path = findNodePath(editor, element)!

  const setIsOpen = useCallback(
    (isOpen: boolean) => {
      const node = getNodeByPath(editor, path)

      if (node) {
        Transforms.setNodes<TagSelectorElement>(
          editor,
          { isOpen },
          { at: path },
        )
      }
    },
    [editor, path],
  )

  const { isOpen } = element

  const { refs, floatingStyles, context } = useFloating({
    whileElementsMounted: autoUpdate,
    open: isOpen,
    onOpenChange: (open: boolean) => {
      setIsOpen(open)

      if (!open) {
        Transforms.unwrapNodes(editor, {
          at: path,
        })

        editor.isTagSelectorOpened = false
      }
    },
    placement: 'bottom-start',
    middleware: [
      offset(10),
      flip({ fallbackAxisSideDirection: 'end' }),
      shift(),
    ],
  })
  const click = useClick(context, {})
  const dismiss = useDismiss(context)
  const role = useRole(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ])

  useEffect(() => {
    const node = getCurrentNode(editor)
    // only open on focus
    if (node) {
      editor.isTagSelectorOpened = true
      setIsOpen(true)
    }
  }, [editor, setIsOpen])

  return (
    <>
      <div
        ref={refs.setReference}
        className="text-base inline-flex relative items-center"
        {...getReferenceProps()}
      >
        {children}
      </div>

      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            id="editor-block-selector"
            style={{
              ...floatingStyles,
              boxShadow:
                '0 0 0 1px rgba(0,0,0,.08),0px 1px 1px rgba(0,0,0,.02),0px 4px 8px -4px rgba(0,0,0,.04),0px 16px 24px -8px rgba(0,0,0,.06)',
            }}
            className="w-[280px] max-h-[280px] px-2 overflow-y-auto rounded-lg z-50 bg-background outline-none"
            {...getFloatingProps({})}
          >
            <TagSelectorContent
              close={() => setIsOpen(false)}
              element={element}
              containerRef={refs.setFloating}
            />
          </div>
        </FloatingPortal>
      )}
    </>
  )
}
