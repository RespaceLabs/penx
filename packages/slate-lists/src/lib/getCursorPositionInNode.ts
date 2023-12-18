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

  try {
    // TODO: too hack, fix for end of link
    const node: any = getNodeByPath(editor, nodeEndPoint.path)
    if (node?.text === '') {
      const prevPath = Path.previous(nodeEndPoint.path)
      nodeEndPoint = Editor.end(editor, prevPath)
    }
  } catch (error) {}

  const isEnd = Point.equals(cursorLocation, nodeEndPoint)

  return { isEnd, isStart }
}
