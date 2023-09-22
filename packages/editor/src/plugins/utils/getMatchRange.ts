import castArray from 'lodash/castArray'
import { AutoformatRule, MatchRange } from '../autoformat/types'

interface MathRange {
  /**
   * start position
   */
  start: string

  /**
   * content after trigger
   */
  end: string

  /**
   * trigger string
   */
  triggers: string[]
}

export const getMatchRange = ({
  match,
  trigger,
}: {
  match: string | MatchRange
  trigger: AutoformatRule['trigger']
}): MathRange => {
  let start: string
  let end: string

  if (typeof match === 'object') {
    start = match.start
    end = match.end
  } else {
    start = match
    end = start.split('').reverse().join('')
  }

  // If a trigger exists, add it to the triggers; otherwise, take the last character.
  const triggers: string[] = trigger ? castArray(trigger) : [end.slice(-1)]

  // If there is a trigger, use the match directly; otherwise, remove the last character.
  end = trigger ? end : end.slice(0, -1)

  return {
    start,
    end,
    triggers,
  }
}
