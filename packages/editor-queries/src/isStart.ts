import { Editor, Location, Point } from 'slate'

/**
 * 当前光标是否在给定 Location 的开始位置
 * {@link Editor.isStart}. If point is null, return false.
 */
export const isStart = (
  editor: Editor,
  point: Point | null | undefined,
  at: Location,
): boolean => !!point && Editor.isStart(editor, point, at)
