import { Editor, Node, NodeEntry, Path } from 'slate'

export const getNodeById = (
  editor: Editor,
  id: string,
): NodeEntry<Node> | null => {
  const entries = Editor.nodes(editor, {
    at: [],
    match: (n: any) => n.id === id,
  })

  if (!entries) return null

  for (const [node, path] of entries) {
    return [node, path]
  }
  return null
}
