import { useEffect, useState } from 'react'
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
import { useSlate, useSlateStatic } from 'slate-react'
import { findNodePath, getCurrentNode } from '@penx/editor-queries'
import { ElementProps } from '@penx/extension-typings'
import { ELEMENT_BLOCK_SELECTOR } from '../constants'
import { BlockSelectorElement } from '../types'
import { BlockSelectorContent } from './BlockSelectorContent'

export const BlockSelector = ({
  element,
  children,
}: ElementProps<BlockSelectorElement>) => {
  const editor = useSlateStatic()
  const path = findNodePath(editor, element)!
  const [isOpen, setIsOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    whileElementsMounted: autoUpdate,
    open: isOpen,
    onOpenChange: (open: boolean) => {
      if (!open) {
        Transforms.unwrapNodes(editor, {
          at: path,
        })
      }
      setIsOpen(open)
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
      setIsOpen(true)
    }
  }, [editor])

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
        <FloatingPortal>
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
        </FloatingPortal>
      )}
    </>
  )
}
