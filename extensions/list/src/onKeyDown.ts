import { Path, Transforms } from 'slate'
import { onKeyDown as onKeyDownList } from 'slate-lists'
import {
  findNodePath,
  getCurrentNode,
  getNodeByPath,
} from '@penx/editor-queries'
import { OnKeyDown } from '@penx/extension-typings'
import { getEmptyParagraph } from '@penx/paragraph'
import { listSchema } from './listSchema'

export const onKeyDown: OnKeyDown = (editor, e) => {
  onKeyDownList(editor, e)

  if (e.key === 'Enter') {
    e.preventDefault()

    // handle enter key on title
    const node = getCurrentNode(editor)!
    const path = findNodePath(editor, node)
    if (!path) return
    const parentPath = Path.parent(path)
    const parentNode: any = getNodeByPath(editor, parentPath)

    if (parentNode?.type === 'title') {
      const nextPath = Path.next(parentPath)

      const listItem = listSchema.createListItemNode({
        children: [
          listSchema.createListItemTextNode({
            children: [getEmptyParagraph()],
          }),
        ],
      })

      Transforms.insertNodes(editor, listItem, {
        select: true,
        at: [...nextPath, 0],
      })
    }
  }
}
