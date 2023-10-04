import castArray from 'lodash/castArray'
import { Node, NodeEntry } from 'slate'
import { QueryNodeOptions } from '@penx/editor-types'

/**
 * Query the node entry.
 */
export const queryNode = <T extends Node>(
  entry?: NodeEntry<T>,
  { filter, allow, exclude }: QueryNodeOptions = {},
) => {
  if (!entry) return false

  if (filter && !filter(entry)) {
    return false
  }

  if (allow) {
    const allows = castArray(allow)

    if (allows.length && !allows.includes((entry[0] as any).type!)) {
      return false
    }
  }

  if (exclude) {
    const excludes = castArray(exclude)

    if (excludes.length && excludes.includes((entry[0] as any).type!)) {
      return false
    }
  }

  return true
}
