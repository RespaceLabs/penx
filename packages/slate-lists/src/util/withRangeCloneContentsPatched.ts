import { patchRangeCloneContents } from './patchRangeCloneContents'

export function withRangeCloneContentsPatched(callback: () => void) {
  const undo = patchRangeCloneContents()
  try {
    callback()
  } finally {
    undo()
  }
}
