import { Checkbox } from '@/components/ui/checkbox'
import { useEditor } from '@/lib/editor-common'
import { ElementProps } from '@/lib/extension-typings'
import { cn } from '@/lib/utils'
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import { CheckListItemElement } from './types'

export const CheckListItem = ({
  attributes,
  element,
  children,
  nodeProps,
}: ElementProps<CheckListItemElement>) => {
  const { id, checked } = element
  const editor = useEditor()
  return (
    <div
      data-key={id}
      className="flex items-center flex-1 leading-normal py1 gap-1"
      {...attributes}
    >
      <Checkbox
        contentEditable={false}
        checked={checked || false}
        onCheckedChange={(value) => {
          const path = ReactEditor.findPath(editor, element)
          Transforms.setNodes(
            editor,
            {
              checked: value,
            } as CheckListItemElement,
            {
              at: path,
            },
          )
        }}
      />
      <div
        className={cn('relative flex-1', checked && 'line-through opacity-60')}
        {...nodeProps}
      >
        {children}
      </div>
    </div>
  )
}
