import {
  insertEmptyList,
  insertEmptyParagraph,
  listSchema,
} from '@/editor-extensions/list'
import { useEditorStatic } from '@/lib/editor-common'
import { findNodePath } from '@/lib/editor-queries'
import { selectEditor } from '@/lib/editor-transforms'
import { cn } from '@/lib/utils'
import { PlusIcon } from 'lucide-react'
import { Editor, Path, Transforms } from 'slate'

const newListItem = listSchema.createListItemNode({
  children: [
    listSchema.createListItemTextNode({
      children: [
        {
          type: 'p',
          children: [{ text: '' }],
        } as any,
      ],
    }),
  ],
})

export function AddBulletBtn() {
  const editor = useEditorStatic()

  function addBullet() {
    if (!editor.isOutliner) {
      const node = editor.children[editor.children.length - 1]
      const nodePath = findNodePath(editor, node)!
      const at = Path.next(nodePath)
      insertEmptyParagraph(editor, { at })
      selectEditor(editor, { focus: true, at })
      return
    }

    if (editor.children.length === 1) {
      insertEmptyList(editor, { at: [1] })
      selectEditor(editor, { focus: true, at: [1] })
      return
    }

    const path = Editor.end(editor, [1]).path

    const node = Editor.above(editor, {
      at: path,
      match: listSchema.isListItemNode,
    })

    if (node) {
      const at = Path.next(node[1])
      Transforms.insertNodes(editor, newListItem, { at })
      selectEditor(editor, { focus: true, at })
    }
  }

  return (
    <div
      className={cn(
        'inline-flex hover:bg-foreground/10 rounded-full items-center text-foreground/40 cursor-pointer mt-2',
        editor.isOutliner && 'mr-[14px] w-5 h-5 rounded-full',
        !editor.isOutliner && '-ml-2',
      )}
      onClick={addBullet}
    >
      <PlusIcon size={14} strokeWidth={1.5} />
    </div>
  )
}
