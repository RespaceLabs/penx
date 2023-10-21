import { Editor, Node, Transforms } from 'slate'
import { getCurrentPath } from '@penx/editor-queries'
import { selectEditor } from '@penx/editor-transforms'
import { OnKeyDown } from '@penx/extension-typings'

export const onKeyDown: OnKeyDown = (editor, e) => {
  const { key, shiftKey } = e

  if (shiftKey && key === 'Tab') {
    console.log('shift+tab')
    return
  }

  if (key === 'Tab') {
    console.log('tab')
    return
  }

  if (key === 'Enter') {
    const path = getCurrentPath(editor)!
    const parent = path.slice(0, -2)

    parent[parent.length - 1] = parent[parent.length - 1] + 1

    e.preventDefault()
    Transforms.insertNodes(
      editor,
      {
        type: 'node',
        children: [
          {
            type: 'p',
            children: [{ text: '' }],
          },
        ],
      },
      {
        at: parent,
        select: true,
      },
    )

    return
  }
}
