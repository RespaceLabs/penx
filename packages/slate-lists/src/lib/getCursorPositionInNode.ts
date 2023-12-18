import { Editor, Path, Point } from 'slate'
import { getNodeByPath } from '../queries/getNodeByPath'

export function getCursorPositionInNode(
  editor: Editor,
  cursorLocation: Point,
  nodePath: Path,
) {
  const nodeStartPoint = Editor.start(editor, nodePath)
  let nodeEndPoint = Editor.end(editor, nodePath)
  const isStart = Point.equals(cursorLocation, nodeStartPoint)

  let isEnd = Point.equals(cursorLocation, nodeEndPoint)
  if (isEnd) {
    return { isEnd, isStart }
  }

  try {
    // TODO: too hack, fix for end of link
    const node: any = getNodeByPath(editor, nodeEndPoint.path)
    if (node?.text === '') {
      const prevPath = Path.previous(nodeEndPoint.path)
      nodeEndPoint = Editor.end(editor, prevPath)

      isEnd = Point.equals(cursorLocation, nodeEndPoint)
    }
  } catch (error) {}

  return { isEnd, isStart }
}
