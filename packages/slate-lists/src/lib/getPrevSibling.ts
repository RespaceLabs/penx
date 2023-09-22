import { Node, Path, type Editor, type NodeEntry } from 'slate'

export function getPrevSibling(editor: Editor, path: Path): NodeEntry | null {
  let previousSiblingPath: Path

  try {
    previousSiblingPath = Path.previous(path)
  } catch (error) {
    // Unable to calculate `Path.previous`, which means there is no previous sibling.
    return null
  }

  if (Node.has(editor, previousSiblingPath)) {
    return [Node.get(editor, previousSiblingPath), previousSiblingPath]
  }

  return null
}
