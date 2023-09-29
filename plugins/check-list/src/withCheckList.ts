import { Editor, Element } from 'slate'

const check_list_item = 'check_list_item'

export const withCheckList = (editor: Editor) => {
  const { apply } = editor
  editor.apply = (operation) => {
    if (operation.type === 'split_node') {
      const { properties } = operation

      if ((properties as Element).type === check_list_item) {
        return apply({
          ...operation,
          properties: {
            ...properties,
            type: check_list_item,
            checked: false,
          },
        })
      }
    }
    return apply(operation)
  }

  return editor
}
