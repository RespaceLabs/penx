import { Node, Path, Transforms } from 'slate'
import { PenxEditor } from '@penx/editor-common'
import { findNode, getCurrentPath, getNodeByPath } from '@penx/editor-queries'
import { nodeToSlate, slateToNodes } from '@penx/serializer'
import { store } from '@penx/store'
import { isListContentElement, isTitle } from '../guard'
import { listSchema } from '../listSchema'
import { ListContentElement } from '../types'

function findListContent(editor: PenxEditor, path: Path) {
  while (path.length > 0) {
    const node = getNodeByPath(editor, path)
    if (isListContentElement(node)) {
      return { node, path }
    }
    path.pop()
  }

  return { node: null, path: [] }
}

function isInTitle(editor: PenxEditor) {
  const res = findNode(editor, {
    at: editor.selection!,
    // mode: 'highest',
    match: isTitle,
  })
  return !!res
}

export const withPaste = (editor: PenxEditor) => {
  const { insertData, insertText } = editor

  editor.insertData = (data: DataTransfer) => {
    const text = data.getData('text/plain')

    const nodeId = editor.copiedNodeId

    if (nodeId) {
      // console.log('=====nodeId:', nodeId)
      const nodes = editor.items.map((n) => n.raw)
      const node = nodes.find((n) => n.id === nodeId)!
      const value = nodeToSlate({
        node,
        nodes,
        isOutliner: true,
        isNewId: true,
      })

      // console.log('value======:', value)

      const path = editor.selection?.anchor.path

      if (!path) return

      const item = findListContent(editor, [...path])

      if (!item.node) return

      let listContent = listSchema.createListItemTextNode({
        children: value[0].children,
      })

      const listChildren = [listContent]

      if (value.length > 1) {
        listChildren.push(value[1])
      }

      const newListItem = listSchema.createListItemNode({
        children: listChildren,
      })

      // console.log('=====newListItem:', newListItem)

      const isEmpty = !Node.string(item.node)
      let at: Path = isEmpty ? item.path : Path.next(item.path)

      console.log('at======:', at)

      if (isEmpty) {
        const nextLiPath = Path.next(Path.parent(item.path))
        const nextLi = getNodeByPath(editor, nextLiPath)
        if (nextLi) {
          Transforms.delete(editor, { at: Path.parent(item.path) })
        }
      }

      Transforms.insertNodes(editor, newListItem, { at, select: true })

      return
    }

    // console.log('=====path:', path)

    if (isInTitle(editor)) {
      return insertData(data)
    }

    console.log('text====:', text, data)

    // return insertText(text)
    insertData(data)
  }

  return editor
}
