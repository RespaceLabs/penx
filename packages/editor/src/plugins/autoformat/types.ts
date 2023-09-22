import { Editor, Point } from 'slate'

export type GetMatchPointsReturnType =
  | undefined
  | {
      beforeStartMatchPoint: Point | undefined
      afterStartMatchPoint: Point | undefined
      beforeEndMatchPoint: Point
    }

export interface MatchRange {
  start: string
  end: string
}

export interface AutoformatQueryOptions
  extends Omit<AutoformatCommonRule, 'query'> {
  /**
   * `insertText` text.
   */
  text: string
}

export interface AutoformatCommonRule {
  /**
   * The rule applies when the trigger and the text just before the cursor matches.
   * For `mode: 'block'`: lookup for the end match(es) before the cursor.
   * For `mode: 'text'`: lookup for the end match(es) before the cursor. If `format` is an array, also lookup for the start match(es).
   * For `mode: 'mark'`: lookup for the start and end matches.
   * Note: `'_*'`, `['_*']` and `{ start: '_*', end: '*_' }` are equivalent.
   */
  match: string | string[] | MatchRange | MatchRange[]

  /**
   * Triggering character to autoformat.
   * @default the last character of `match` or `match.end`
   */
  trigger?: string | string[]
}

export interface AutoformatBlockRule extends AutoformatCommonRule {
  /**
   * - text: insert text.
   * - block: set block type or custom format.
   * - mark: insert mark(s) between matches.
   * @default 'text'
   */
  mode: 'block'

  /**
   * For `mode: 'block'`: set block type. If `format` is defined, this field is ignored.
   * For `mode: 'mark'`: Mark(s) to add.
   */
  type?: string

  /**
   * If true, the trigger should be at block start to allow autoformatting.
   * 是否在 block 开始位置触发
   * @default true
   */
  triggerAtBlockStart?: boolean

  /**
   * If true, allow to autoformat even if there is a block of the same type above the selected block.
   * @default false
   */
  allowSameTypeAbove?: boolean

  /**
   * Function called just before `format`.
   * Generally used to reset the selected block.
   */
  preFormat?: (editor: Editor) => void

  /**
   * Custom formatting function.
   * @default setNodes(editor, { type }, { match: (n) => Editor.isBlock(editor, n) })
   */
  format?: (editor: Editor) => void
}

export interface AutoformatMarkRule extends AutoformatCommonRule {
  mode: 'mark'

  /**
   * Mark(s) to add.
   */
  type: string | string[]

  /**
   * If false, do not format when the string can be trimmed.
   */
  ignoreTrim?: boolean
}

export interface AutoformatTextRule extends AutoformatCommonRule {
  mode: 'text'

  /**
   * string: the matched text is replaced by that string.
   */
  format: string
}

export type AutoformatRule =
  | AutoformatBlockRule
  | AutoformatMarkRule
  | AutoformatTextRule
