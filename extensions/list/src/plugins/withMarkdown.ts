import markdown from 'remark-parse'
import { insertText, Node, Path, Transforms } from 'slate'
import { unified } from 'unified'
import { PenxEditor } from '@penx/editor-common'
import { findNode, getCurrentPath } from '@penx/editor-queries'
import slate from '@penx/remark-slate'
import { isTitle } from '../guard'
import { listSchema } from '../listSchema'

function isInTitle(editor: PenxEditor) {
  const res = findNode(editor, {
    at: editor.selection!,
    // mode: 'highest',
    match: isTitle,
  })
  return !!res
}

function isSingleLine(nodes: Node[]) {
  return nodes?.length === 1
}

export const withMarkdown = (editor: PenxEditor) => {
  const { insertData, insertText } = editor

  editor.insertData = (data: DataTransfer) => {
    const text = data.getData('text/plain')

    const file = unified().use(markdown).use(slate).processSync(text)

    if (file.result) {
      if (isInTitle(editor)) {
        return insertData(data)
      }

      const nodes = resultToSlateNode(file.result as any)

      if (isSingleLine(nodes)) {
        return insertText(Node.string(nodes[0]))
      }

      const path = getCurrentPath(editor)!
      const listItemPath = path.slice(0, path.length - 2)

      Transforms.insertNodes(editor, nodes, {
        at: Path.next(listItemPath),
      })

      return
    }

    insertData(data)
  }

  return editor
}

type Item = {
  type: string
  children: Array<{
    text: string
    [key: string]: any
  }>[]
}

export function resultToSlateNode(items: Item[]) {
  const nodes = items.reduce((acc, item) => {
    if (['ul', 'ol'].includes(item.type)) {
      const list = listNodeToSlateNode(item as any)
      acc.push(...list.children)
    } else {
      acc.push(
        listSchema.createListItemNode({
          children: [
            listSchema.createListItemTextNode({
              children: [item as any],
            }),
          ],
        }),
      )
    }

    return acc
  }, [] as any[])

  return nodes
}

type ListNode = {
  children: ListNode[]
  type: string
  [key: string]: any
}

function listNodeToSlateNode(listNode: ListNode): ListNode {
  const clonedNode: ListNode = {
    type: listNode.type,
    children: [],
  }

  if (listNode?.children?.length) {
    for (const child of listNode.children) {
      if (!['ul', 'ol', 'li'].includes(child.type)) {
        clonedNode.children.push(
          listSchema.createListItemTextNode({
            children: [child],
          }) as any,
        )
      } else {
        const clonedChild = listNodeToSlateNode(child)
        clonedNode.children.push(clonedChild)
      }
    }
  }

  return clonedNode
}
