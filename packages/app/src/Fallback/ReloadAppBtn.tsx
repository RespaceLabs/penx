import { Button } from 'uikit'
import { store } from '@penx/store'

export const ReloadAppBtn = () => {
  // TODO:
  async function reloadApp() {
    const node = store.node.getRootNode()
    store.node.selectNode(node, 0, false)
    window.location.reload()
  }

  return <Button onClick={() => reloadApp()}>Reload App</Button>
}
