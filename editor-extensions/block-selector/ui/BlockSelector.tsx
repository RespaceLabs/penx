import { useCallback, useEffect, useState } from 'react'
import { useEditorStatic } from '@/lib/editor-common'
import { findNodePath, getCurrentNode } from '@/lib/editor-queries'
import { ElementProps } from '@/lib/extension-typings'
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react'
import { Transforms } from 'slate'
import { BlockSelectorElement } from '../types'
import { BlockSelectorContent } from './BlockSelectorContent'

export const BlockSelector = ({
  element,
  children,
}: ElementProps<BlockSelectorElement>) => {
  const editor = useEditorStatic()
  const path = findNodePath(editor, element)!

  const setIsOpen = useCallback(
    (isOpen: boolean) => {
      Transforms.setNodes<BlockSelectorElement>(
        editor,
        { isOpen },
        { at: path },
      )
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

        // editor.isBlockSelectorOpened = false
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
      editor.isBlockSelectorOpened = true
      setIsOpen(true)
    }
  }, [editor, setIsOpen])

  return (
    <>
      <div
        ref={refs.setReference}
        className="text-balance inline-flex relative items-center"
        {...getReferenceProps()}
      >
        {children}
      </div>

      {isOpen && (
        // <FloatingPortal></FloatingPortal>
        <div
          ref={refs.setFloating}
          id="editor-block-selector"
          style={{
            ...floatingStyles,
            boxShadow:
              '0 0 0 1px rgba(0,0,0,.08),0px 1px 1px rgba(0,0,0,.02),0px 4px 8px -4px rgba(0,0,0,.04),0px 16px 24px -8px rgba(0,0,0,.06)',
          }}
          className="w-[280px] max-h-[300px] overflow-y-auto-auto rounded z-50 bg-background outline-none"
          {...getFloatingProps({})}
        >
          <BlockSelectorContent
            close={() => setIsOpen(false)}
            element={element}
            containerRef={refs.setFloating}
          />
        </div>
      )}
    </>
  )
}
