import { Editor } from 'slate'
import { PenxEditor } from '@penx/editor-common'
import { getNodeByPath } from '@penx/editor-queries'
import { isListContentElement, UnorderedListElement } from '@penx/list'
import { Node, WithFlattenedProps } from '@penx/model'
import { NodeListService } from '@penx/service'

export function editorValueToNode(
  nodeList: NodeListService,
  editor: PenxEditor,
  ul: UnorderedListElement,
): WithFlattenedProps<Node>[] {
  const listContents = Editor.nodes(editor, {
    at: [],
    match: isListContentElement,
  })

  let items: WithFlattenedProps<Node>[] = []
  for (const [item, path] of listContents) {
    const depth = (path.length - 3) / 2
    // console.log('log======item:', 'path:', path, 'depth:', depth)
    const node = nodeList.getNode(item.id)

    const grandparent = getNodeByPath(editor, path.slice(0, -3)) as any

    items.push(
      Object.assign(node, {
        depth,
        parentId: depth === 0 ? null : grandparent.children[0].id,
        index: 0,
      }),
    )
  }
  return items
}
