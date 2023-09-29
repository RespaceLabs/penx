import castArray from 'lodash/castArray'
import { Editor, Point, Range, Transforms } from 'slate'
import { getMatchPoints } from '../getMatchPoints'
import { getMatchRange } from '../getMatchRange'
import { AutoformatTextRule } from '../types'

export interface AutoformatTextOptions extends AutoformatTextRule {
  text: string
}

export const formatText = (
  editor: Editor,
  { text, match: _match, trigger, format }: AutoformatTextOptions,
) => {
  const selection = editor.selection as Range
  const matches = castArray(_match as string | string[])

  for (const match of matches) {
    const { start, end, triggers } = getMatchRange({
      match: { start: '', end: match },
      trigger,
    })

    if (!triggers.includes(text)) continue

    const matched = getMatchPoints(editor, { start, end })
    if (!matched) continue

    const { afterStartMatchPoint, beforeEndMatchPoint, beforeStartMatchPoint } =
      matched

    if (end) {
      Transforms.delete(editor, {
        at: {
          anchor: beforeEndMatchPoint,
          focus: selection.anchor,
        },
      })
    }

    const formatEnd = Array.isArray(format) ? format[1] : format
    editor.insertText(formatEnd)

    if (beforeStartMatchPoint) {
      const formatStart = Array.isArray(format) ? format[0] : format

      Transforms.delete(editor, {
        at: {
          anchor: beforeStartMatchPoint as Point,
          focus: afterStartMatchPoint as Point,
        },
      })

      Transforms.insertText(editor, formatStart, {
        at: beforeStartMatchPoint,
      })
    }

    return true
  }

  return false
}
