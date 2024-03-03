import { ELEMENT_TODO } from '@penx/constants'
import { PenxEditor } from '@penx/editor-common'
import { CheckListItemElement } from './types'

export const withCheckList = (editor: PenxEditor) => {
  const { apply } = editor
  editor.apply = (operation) => {
    if (operation.type === 'split_node') {
      const { properties } = operation

      if ((properties as CheckListItemElement).type === ELEMENT_TODO) {
        return apply({
          ...operation,
          properties: {
            ...properties,
            type: ELEMENT_TODO,
            checked: false,
          } as CheckListItemElement,
        })
      }
    }
    return apply(operation)
  }

  return editor
}
