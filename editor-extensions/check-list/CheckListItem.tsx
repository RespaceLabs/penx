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
      className="flex items-center flex-1 leading-normal py1"
      {...attributes}
      // h="1.5em"
    >
      <Checkbox
        contentEditable={false}
        checked={checked || false}
        onChange={(event) => {
          const path = ReactEditor.findPath(editor, element as any)
          Transforms.setNodes(
            editor,
            {
              // checked: event.target.checked,
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
