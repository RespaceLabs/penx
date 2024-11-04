import { useEffect, useState } from 'react'
import { useEditorStatic } from '@/lib/editor-common'
import { findNodePath, getCurrentNode } from '@/lib/editor-queries'
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
import { useSlateStatic } from 'slate-react'
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
      <div
        ref={refs.setReference}
        className="inline-flex relative items-center"
        {...getReferenceProps()}
      >
        {children}
      </div>

      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            id="internal-link-selector"
            style={floatingStyles}
            className="w-[280px] max-h-[200] overflow-y-auto shadow rounded-lg z-50 bg-background outline-none"
            {...getFloatingProps({})}
          >
            <BidirectionalLinkSelectorContent
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
