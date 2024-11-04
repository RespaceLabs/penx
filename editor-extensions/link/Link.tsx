import { useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { findNodePath } from '@/lib/editor-queries'
import { ElementProps } from '@/lib/extension-typings'
import { useCopyToClipboard } from '@/lib/shared'
import { FloatingDelayGroup } from '@floating-ui/react'
import { Check, Copy, Globe, Trash2 } from 'lucide-react'
import { Transforms } from 'slate'
import { useSlateStatic } from 'slate-react'
import { toast } from 'sonner'
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
    <div className="relative inline-block">
      <FloatingDelayGroup delay={400}>
        <Popover open={isOpen} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <a
              href={element.url}
              target="_blank"
              className="relative m-0 py-1 leading-normal text-base text-brand-500"
              {...attributes}
              {...nodeProps}
            >
              {children}
            </a>
          </PopoverTrigger>
          <PopoverContent>
            <div
              contentEditable={false}
              className="shadow rounded flex items-center justify-between bg-background w-[400px]"
            >
              <div
                className="text-foreground/50 cursor-pointer hover:bg-foreground/5 rounded p-1 ml-2"
                onClick={() => {
                  window.open(element.url, '_blank')
                }}
              >
                <Globe size={24} />
              </div>
              <Input
                placeholder="Type a link"
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
              <div className="flex items-center">
                <Copy
                  size={24}
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
                <div
                  className="inline-flex border-l border-foreground/15 ml-1 w-10 items-center justify-between hover:bg-foreground/10 cursor-pointer"
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
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </FloatingDelayGroup>
    </div>
  )
}
