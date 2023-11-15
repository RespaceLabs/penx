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
import { useSlateStatic } from 'slate-react'
import { useEditorStatic } from '@penx/editor-common'
import { findNodePath, getCurrentNode } from '@penx/editor-queries'
import { ElementProps } from '@penx/extension-typings'
import { BidirectionalLinkSelectorElement } from '../types'
import { BidirectionalLinkSelectorContent } from './BidirectionalLinkSelectorContent'

export const BidirectionalLinkSelector = ({
  element,
  children,
}: ElementProps<BidirectionalLinkSelectorElement>) => {
  const editor = useEditorStatic()
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
        editor.isBidirectionalLinkSelector = false
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
      editor.isBidirectionalLinkSelector = true
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
            id="internal-link-selector"
            style={floatingStyles}
            w-280
            maxH-200
            overflowYAuto
            shadowPopover
            roundedLG
            zIndex-10000
            bgWhite
            outlineNone
            {...getFloatingProps({})}
          >
            <BidirectionalLinkSelectorContent
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
