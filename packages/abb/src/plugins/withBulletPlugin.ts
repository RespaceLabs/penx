import { PenxEditor } from '@penx/editor-common'
import { db } from '@penx/local-db'
import { store } from '@penx/store'

export function withBulletPlugin(editor: PenxEditor) {
  editor.onClickBullet = async (nodeId: string) => {
    const node = await db.getNode(nodeId)
    store.node.selectNode(node)
  }
  return editor
}
