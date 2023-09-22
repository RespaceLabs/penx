import { EditorPlugin } from '@penx/editor-types'
import { withSaveToServer } from './withSaveToServer'

export default function saveToServer(): EditorPlugin {
  return {
    with: withSaveToServer,
  }
}
