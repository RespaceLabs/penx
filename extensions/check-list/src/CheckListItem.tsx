import { Box } from '@fower/react'
import { Element, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import { Checkbox } from 'uikit'
import { useEditor } from '@penx/editor-common'
import { ElementProps } from '@penx/extension-typings'
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
    <Box data-key={id} toLeft flex-1 leadingNormal textBase {...attributes}>
      <Checkbox
        contentEditable={false}
        colorScheme="gray800"
        mr2
        checked={checked || false}
        onChange={(event) => {
          const path = ReactEditor.findPath(editor, element as any)
          Transforms.setNodes(
            editor,
            { checked: event.target.checked } as CheckListItemElement,
            {
              at: path,
            },
          )
        }}
      />
      <Box
        relative
        flex-1
        leadingNormal
        lineThrough={checked}
        opacity-60={checked}
        {...nodeProps}
      >
        {children}
      </Box>
    </Box>
  )
}
