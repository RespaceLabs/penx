import { PenxEditor } from '@penx/editor-common'
import { HeadingElement } from './types'

export const withHeading = (editor: PenxEditor) => {
  const { apply } = editor

  editor.apply = (operation) => {
    if (operation.type === 'split_node') {
      const { properties } = operation
      if (
        ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(
          (properties as HeadingElement).type,
        )
      ) {
        return apply({
          ...operation,
          properties: {
            ...properties,
            type: 'p',
          } as any,
        })
      }
    }
    return apply(operation)
  }

  return editor
}
