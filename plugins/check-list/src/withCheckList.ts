import { Editor, Element } from 'slate'
import { CheckListItemElement, ElementType } from './types'

export const withCheckList = (editor: Editor) => {
  const { apply } = editor
  editor.apply = (operation) => {
    if (operation.type === 'split_node') {
      const { properties } = operation

      if (
        (properties as CheckListItemElement).type ===
        ElementType.check_list_item
      ) {
        return apply({
          ...operation,
          properties: {
            ...properties,
            type: ElementType.check_list_item,
            checked: false,
          } as CheckListItemElement,
        })
      }
    }
    return apply(operation)
  }

  return editor
}
