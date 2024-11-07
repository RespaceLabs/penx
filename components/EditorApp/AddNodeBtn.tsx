import { findNodePath, selectEditor } from '@udecode/plate-common/react'
import { PlusIcon } from 'lucide-react'
import { Editor, Path, Transforms } from 'slate'
import { insertEmptyParagraph } from '../editor/lib/insertEmptyParagraph'
import { useCreateEditor } from '../editor/use-create-editor'

interface Props {
  editor: ReturnType<typeof useCreateEditor>
}

export function AddNodeBtn({ editor }: Props) {
  function add() {
    const node = editor.children[editor.children.length - 1]
    const nodePath = findNodePath(editor, node)!
    const at = Path.next(nodePath)
    insertEmptyParagraph(editor as any, { at })
    selectEditor(editor, { focus: true, at })
    return
  }

  return (
    <div
      className="inline-flex bg-foreground/5 hover:bg-foreground/10 rounded-full items-center justify-center text-foreground/40 cursor-pointer w-4 h-4"
      onClick={add}
    >
      <PlusIcon size={14} strokeWidth={1.5} />
    </div>
  )
}
