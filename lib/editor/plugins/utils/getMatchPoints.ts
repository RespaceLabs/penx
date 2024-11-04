import { MatchRange } from '@/lib/autoformat'
import { getPointBefore } from '@/lib/editor-queries'
import { Editor, Point, Range } from 'slate'
import { isPreviousCharacterEmpty } from './isPreviousCharacterEmpty'

export type GetMatchPointsReturnType =
  | undefined
  | {
      beforeStartMatchPoint: Point | undefined
      afterStartMatchPoint: Point | undefined
      beforeEndMatchPoint: Point
    }

export const getMatchPoints = (editor: Editor, { start, end }: MatchRange) => {
  const selection = editor.selection as Range

  let beforeEndMatchPoint = selection.anchor
  if (end) {
    beforeEndMatchPoint = getPointBefore(editor, selection, {
      matchString: end,
    })

    if (!beforeEndMatchPoint) return
  }

  let afterStartMatchPoint: Point | undefined
  let beforeStartMatchPoint: Point | undefined

  if (start) {
    afterStartMatchPoint = getPointBefore(editor, beforeEndMatchPoint, {
      matchString: start,
      skipInvalid: true,
      afterMatch: true,
    })

    if (!afterStartMatchPoint) return

    beforeStartMatchPoint = getPointBefore(editor, beforeEndMatchPoint, {
      matchString: start,
      skipInvalid: true,
    })

    if (!isPreviousCharacterEmpty(editor, beforeStartMatchPoint as Point))
      return
  }

  return {
    afterStartMatchPoint,
    beforeStartMatchPoint,
    beforeEndMatchPoint,
  }
}
