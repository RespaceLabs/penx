import { useState } from 'react'
import { FloatingDelayGroup } from '@floating-ui/react'
import { Box } from '@fower/react'
import { Check, Globe, Trash2 } from 'lucide-react'
import { Transforms } from 'slate'
import { useSlateStatic } from 'slate-react'
import { Input, Popover, PopoverContent, PopoverTrigger, toast } from 'uikit'
import { findNodePath } from '@penx/editor-queries'
import { ElementProps } from '@penx/extension-typings'
import { IconCopy } from '@penx/icons'
import { useCopyToClipboard } from '@penx/shared'
import { useLinkIsOpen } from './linkIsOpen.store'
import { LinkElement } from './types'

type Props = ElementProps<LinkElement>

export const Link = ({ attributes, element, children, nodeProps }: Props) => {
  const editor = useSlateStatic()
  const [url, setUrl] = useState(element.url || '')
  const { isOpen, setOpen, close } = useLinkIsOpen(element.id)
  const path = findNodePath(editor, element)!
  const { copy } = useCopyToClipboard()
  return (
    <Box inlineBlock relative>
      <FloatingDelayGroup delay={400}>
        <Popover
          placement="bottom-start"
          isOpen={isOpen}
          onOpenChange={setOpen}
        >
          <PopoverTrigger asChild>
            <Box
              as="a"
              href={element.url}
              target="_blank"
              relative
              m0
              py1
              leadingNormal
              textBase
              brand500
              {...attributes}
              {...nodeProps}
            >
              {children}
            </Box>
          </PopoverTrigger>
          <PopoverContent>
            <Box
              contentEditable={false}
              shadowPopover
              rounded
              toCenterY
              toBetween
              bgWhite
              w-400
            >
              <Box
                gray500
                cursorPointer
                bgGray100--hover
                rounded
                p1
                ml2
                onClick={() => {
                  window.open(element.url, '_blank')
                }}
              >
                <Globe size={24} />
              </Box>
              <Input
                placeholder="Type a link"
                ring-0--focus
                borderTransparent
                borderTransparent--focus
                flex-1
                autoFocus
                pl1--i
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  e.stopPropagation()
                  if (e.key === 'Enter') {
                    Transforms.setNodes<LinkElement>(
                      editor,
                      { url },
                      { at: path },
                    )
                    close()
                  }
                }}
              />
              <Box toCenterY>
                <IconCopy
                  size={24}
                  gray500
                  cursorPointer
                  bgGray100--hover
                  rounded
                  p1
                  onClick={() => {
                    copy(element.url)
                    toast.success('Link copied to clipboard')
                  }}
                />
                <Trash2
                  size={24}
                  onClick={() => {
                    Transforms.unwrapNodes(editor, {
                      at: [],
                      match: (n: any) => n.id === element.id,
                    })
                  }}
                />
                <Box
                  inlineFlex
                  borderLeft
                  borderGray200
                  ml1
                  h-40
                  w-40
                  toCenter
                  bgGray100--hover
                  cursorPointer
                  onClick={() => {
                    Transforms.setNodes<LinkElement>(
                      editor,
                      { url },
                      { at: path },
                    )
                    setOpen(false)
                  }}
                >
                  <Check />
                </Box>
              </Box>
            </Box>
          </PopoverContent>
        </Popover>
      </FloatingDelayGroup>
    </Box>
  )
}
