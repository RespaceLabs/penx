import { isMobile } from 'react-device-detect'
import { PenxEditor } from '@/lib/editor-common'
import { bulletDrawerAtom } from '@/hooks'
import { db } from '@/lib/local-db'
import { store } from '@/store'

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
