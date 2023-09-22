import { EditorPlugin } from '@penx/editor-types'
import { withAutoformat } from './withAutoformat'

export default function autoformat(): EditorPlugin {
  return {
    with: withAutoformat,
  }
}
