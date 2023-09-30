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
import { findNodePath, getCurrentNode } from '@penx/editor-queries'
import { ElementProps } from '@penx/plugin-typings'
import { InternalLinkSelectorElement } from '../custom-types'
import { InternalLinkSelectorContent } from './InternalLinkSelectorContent'

export const InternalLinkSelector = ({
  element,
  children,
}: ElementProps<InternalLinkSelectorElement>) => {
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
            <InternalLinkSelectorContent
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
