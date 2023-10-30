import markdown from 'remark-parse'
import { Path, Transforms } from 'slate'
import { unified } from 'unified'
import { PenxEditor } from '@penx/editor-common'
import { getCurrentPath } from '@penx/editor-queries'
import slate from '@penx/remark-slate'
import { listSchema } from './listSchema'

export const withMarkdown = (editor: PenxEditor) => {
  const { insertData } = editor

  editor.insertData = (data: DataTransfer) => {
    const text = data.getData('text/plain')

    const file = unified().use(markdown).use(slate).processSync(text)

    if (file.result) {
      const path = getCurrentPath(editor)!
      const listItemPath = path.slice(0, path.length - 2)

      const nodes = resultToSlateNode(file.result as any)

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
