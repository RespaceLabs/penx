import { Editor } from 'slate'
import { ElementType } from '@penx/editor-shared'

export const withHeading = (editor: Editor) => {
  const { apply } = editor
  editor.apply = (operation) => {
    if (operation.type === 'split_node') {
      const { properties } = operation

      if (
        [
          ElementType.h1,
          ElementType.h2,
          ElementType.h3,
          ElementType.h4,
          ElementType.h5,
          ElementType.h6,

          // TODO: should not here
          ElementType.blockquote,
        ].includes(properties.type as ElementType)
      ) {
        return apply({
          ...operation,
          properties: {
            ...properties,
            css: undefined,
            type: ElementType.p,
          } as any,
        })
      }
    }
    return apply(operation)
  }

  return editor
}
