import { Editor, Node, Path, Transforms, wrapNodes } from 'slate'
import { isParagraph } from '@penx/paragraph'
import { ELEMENT_NODE } from './constants'
import { isNode } from './isNode'
import { NodeElement } from './types'

export function withNode(editor: Editor) {
  const { apply, normalizeNode } = editor

  editor.apply = (operation) => {
    // if (operation.type === 'insert_node') {
    //   return apply({ ...operation })
    // }

    if (operation.type === 'split_node') {
      const { properties } = operation

      if (!Reflect.has(properties, 'type')) {
        return apply({ ...operation })
      }

      console.log('properties:', properties)

      // return apply({
      //   ...operation,
      //   properties: {
      //     ...properties,
      //   },
      // })

      return
    }

    return apply(operation)
  }

  editor.normalizeNode = ([node, path]) => {
    if (isParagraph(node)) {
      const parent = Node.parent(editor, path)
      if (isNode(parent)) {
        return
      }

      console.log('node:', node)

      // Transforms.wrapNodes(editor, {
      //   type: ELEMENT_NODE,
      //   children: [node],
      // } as any)
      return
    }
    // normalizeNode([node, path])
  }

  return editor
}
