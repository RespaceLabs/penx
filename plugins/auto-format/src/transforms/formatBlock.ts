import castArray from 'lodash/castArray'
import { Editor, Element, Range, Transforms } from 'slate'
import {
  getRangeBefore,
  getRangeFromBlockStart,
  getText,
  someNode,
} from '@penx/editor-queries'
import { ElementType, genId } from '@penx/editor-shared'
import { setNodes } from '@penx/editor-transforms'
import { getMatchRange } from '../getMatchRange'
import { AutoformatBlockRule } from '../types'

export interface AutoformatBlockOptions extends AutoformatBlockRule {
  text: string
}

/**
 * auto format the block type
 * @param editor
 * @returns
 */
export const formatBlock = (editor: Editor, opt: AutoformatBlockOptions) => {
  const {
    text,
    trigger,
    match: _match,
    type = ElementType.p,
    allowSameTypeAbove = false,
    preFormat,
    format,
    triggerAtBlockStart = true,
  } = opt

  // convert to array
  const matches = castArray(_match as string | string[])

  for (const match of matches) {
    const { end, triggers } = getMatchRange({
      match: { start: '', end: match },
      trigger,
    })

    // not trigger, skip it
    if (!triggers.includes(text)) continue

    let matchRange: Range | undefined

    if (triggerAtBlockStart) {
      matchRange = getRangeFromBlockStart(editor) as Range

      // Don't autoformat if there is void nodes.
      const hasVoidNode = someNode(editor, {
        at: matchRange,
        match: (n: Element) => Editor.isVoid(editor, n),
      })

      if (hasVoidNode) continue

      const textFromBlockStart = getText(editor, matchRange)

      if (end !== textFromBlockStart) continue
    } else {
      // like code block
      matchRange = getRangeBefore(editor, editor.selection as Range, {
        matchString: end,
      })
      if (!matchRange) continue
    }

    if (!allowSameTypeAbove) {
      // Don't autoformat if already in a block of the same type.
      const isBelowSameBlockType = someNode(editor, { match: { type } })
      if (isBelowSameBlockType) continue
    }

    // remove the matched text
    Transforms.delete(editor, { at: matchRange })

    preFormat?.(editor)

    // default type
    if (!format) {
      console.log('default type....')

      setNodes(
        editor,
        {
          type,
          id: genId(), // auto id
        },
        {
          match: (n) => {
            return Element.isElement(n) && Editor.isBlock(editor, n)
          },
        },
      )
    } else {
      format(editor)
    }

    return true
  }

  return false
}
