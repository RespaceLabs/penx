import { isMobile } from 'react-device-detect'
import { PenxEditor } from '@penx/editor-common'
import { bulletDrawerAtom } from '@penx/hooks'
import { db } from '@penx/local-db'
import { store } from '@penx/store'

export function withBulletPlugin(editor: PenxEditor) {
  editor.onClickBullet = async (nodeId: string, element: any) => {
    const node = await db.getNode(nodeId)

    if (isMobile) {
      store.set(bulletDrawerAtom, {
        isOpen: true,
        node,
        element,
      })
    } else {
      store.node.selectNode(node)
    }
  }
  return editor
}
