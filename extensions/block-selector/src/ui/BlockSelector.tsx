import { useCallback, useEffect, useState } from 'react'
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
import { Box } from '@fower/react'
import { Transforms } from 'slate'
import { useEditorStatic } from '@penx/editor-common'
import { findNodePath, getCurrentNode } from '@penx/editor-queries'
import { ElementProps } from '@penx/extension-typings'
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

        editor.isBlockSelectorOpened = false
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
      <Box
        ref={refs.setReference}
        textBase
        inlineFlex
        relative
        toCenterY
        {...getReferenceProps()}
      >
        {children}
      </Box>

      {isOpen && (
        // <FloatingPortal></FloatingPortal>
        <Box
          ref={refs.setFloating}
          id="editor-block-selector"
          style={floatingStyles}
          w-280
          maxH-200
          overflowYAuto
          shadow="0 0 0 1px rgba(0,0,0,.08),0px 1px 1px rgba(0,0,0,.02),0px 4px 8px -4px rgba(0,0,0,.04),0px 16px 24px -8px rgba(0,0,0,.06)"
          roundedLG
          zIndex-10000
          bgWhite
          outlineNone
          {...getFloatingProps({})}
        >
          <BlockSelectorContent
            close={() => setIsOpen(false)}
            element={element}
            containerRef={refs.setFloating}
          />
        </Box>
      )}
    </>
  )
}
