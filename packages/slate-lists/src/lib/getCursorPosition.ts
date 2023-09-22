import type { Point } from 'slate'
import { Editor, Path, Range, Span } from 'slate'

/**
 * Get the cursor position for the given location.
 * Always returns null for expanded selections (Range, Span).
 */
export function getCursorPosition(
  editor: Editor,
  at: Range | Point | Span | Path | null,
): Point | null {
  if (!at) {
    return null
  }
  if (Range.isRange(at)) {
    return Range.isCollapsed(at) ? at.focus : null
  }
  if (Span.isSpan(at)) {
    return Path.equals(at[0], at[1]) ? getCursorPosition(editor, at[0]) : null
  }
  if (Path.isPath(at)) {
    return Editor.point(editor, at, { edge: 'start' })
  }
  return at // Point
}
