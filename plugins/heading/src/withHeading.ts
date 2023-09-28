import { Editor, Element } from 'slate'

export const withHeading = (editor: Editor) => {
  const { apply } = editor
  editor.apply = (operation) => {
    if (operation.type === 'split_node') {
      const { properties } = operation

      if (
        ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(
          (properties as Element).type,
        )
      ) {
        return apply({
          ...operation,
          properties: {
            ...properties,
            type: 'p',
          },
        })
      }
    }
    return apply(operation)
  }

  return editor
}
