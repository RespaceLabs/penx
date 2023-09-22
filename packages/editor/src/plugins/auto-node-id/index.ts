import { EditorPlugin } from '@penx/editor-types'
import { withAutoNodeId } from './withAutoNodeId'

export default function autoNodeId(): EditorPlugin {
  return {
    with: withAutoNodeId,
  }
}
