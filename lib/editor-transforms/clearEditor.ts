import { Editor, Transforms } from 'slate'

export function clearEditor(editor: Editor) {
  // Delete all entries leaving 1 empty node
  Transforms.delete(editor, {
    at: {
      anchor: Editor.start(editor, []),
      focus: Editor.end(editor, []),
    },
  })

  // Removes empty node
  Transforms.removeNodes(editor, {
    at: [0],
  })
}
