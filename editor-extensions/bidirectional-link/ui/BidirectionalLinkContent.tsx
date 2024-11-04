import { useEditorStatic } from '@/lib/editor-common'
import { ElementProps } from '@/lib/extension-typings'
import { cn } from '@/lib/utils'
import { store } from '@/store'
import { useSelected } from 'slate-react'
import { BidirectionalLinkContentElement } from '../types'

export const BidirectionalLinkContent = ({
  element,
  children,
  attributes,
}: ElementProps<BidirectionalLinkContentElement>) => {
  const editor = useEditorStatic()
  let selected = useSelected()
  const { linkId } = element
  const node = editor.items.find((item) => item.id === linkId)

  const trigger = (
    <div
      className={cn(
        'inline-flex items-center relative rounded py-1 px-1 cursor-pointer',
        selected && 'bg-foreground/5',
      )}
      {...attributes}
      contentEditable={false}
      onClick={(e) => {
        e.preventDefault()
        store.node.selectNode(node?.raw!)
      }}
    >
      {children}
      <div className="text-foreground/40">
        <span>[[</span>
        <span className="inline-flex text-brand-500">
          {node?.title || 'Untitled'}
        </span>
        <span>]]</span>
      </div>
    </div>
  )

  return trigger
}
