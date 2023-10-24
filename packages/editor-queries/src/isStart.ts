import { Editor, Location, Point } from 'slate'

/**
 * check if the cursor is at the start of the given location
 * {@link Editor.isStart}. If point is null, return false.
 */
export const isStart = (
  editor: Editor,
  point: Point | null | undefined,
  at: Location,
): boolean => !!point && Editor.isStart(editor, point, at)
