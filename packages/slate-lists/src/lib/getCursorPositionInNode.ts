import { Editor, Point, type Path } from 'slate'

export function getCursorPositionInNode(
  editor: Editor,
  cursorLocation: Point,
  nodePath: Path,
) {
  const nodeStartPoint = Editor.start(editor, nodePath)
  const nodeEndPoint = Editor.end(editor, nodePath)
  const isStart = Point.equals(cursorLocation, nodeStartPoint)
  const isEnd = Point.equals(cursorLocation, nodeEndPoint)
  return { isEnd, isStart }
}
