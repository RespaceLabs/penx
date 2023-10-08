import { Editor, Element } from 'slate'
import { ELEMENT_CHECK_LIST_ITEM } from './constants'
import { CheckListItemElement } from './types'

export const withCheckList = (editor: Editor) => {
  const { apply } = editor
  editor.apply = (operation) => {
    if (operation.type === 'split_node') {
      const { properties } = operation

      if (
        (properties as CheckListItemElement).type === ELEMENT_CHECK_LIST_ITEM
      ) {
        return apply({
          ...operation,
          properties: {
            ...properties,
            type: ELEMENT_CHECK_LIST_ITEM,
            checked: false,
          } as CheckListItemElement,
        })
      }
    }
    return apply(operation)
  }

  return editor
}
