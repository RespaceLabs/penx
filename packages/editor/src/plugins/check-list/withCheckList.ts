import { Editor } from 'slate'
import { ElementType } from '@penx/editor-shared'

export const withCheckList = (editor: Editor) => {
  const { apply } = editor
  editor.apply = (operation) => {
    if (operation.type === 'split_node') {
      const { properties } = operation

      if (properties.type === ElementType.check_list_item) {
        return apply({
          ...operation,
          properties: {
            ...properties,
            type: ElementType.check_list_item,
            checked: false,
          },
        })
      }
    }
    return apply(operation)
  }

  return editor
}
