import { useActiveNode, useRouterStore } from '@/hooks'
import { WORKBENCH_NAV_HEIGHT } from '@/lib/constants'
import { Node } from '@/lib/model'
import { useNodeContext } from '@/lib/node-hooks'
import { PaletteDrawer } from '../PaletteDrawer'
import { Breadcrumb } from './Breadcrumb'

function Title() {
  const { activeNode } = useActiveNode()
  const router = useRouterStore()

  if (router.isTodos()) {
    return <div className="font-semibold text-lg">Tasks</div>
  }

  if (!activeNode) {
    return <div></div>
  }

  const node = new Node(activeNode)

  if (node.isDaily || node.isDatabaseRoot) {
    return <div className="font-semibold text-lg">{node.title}</div>
  }

  return (
    <div className="px-4 w-screen overflow-x-auto py-1">
      <Breadcrumb />
    </div>
  )
}

export const MobileNav = () => {
  const routerStore = useRouterStore()
  const { node } = useNodeContext()
  const showIcon =
    routerStore.isShowMobileMenu() ||
    node?.isDaily ||
    node?.isDatabaseRoot ||
    node?.isDailyRoot ||
    node?.isDatabase

  return (
    <div
      style={{ height: WORKBENCH_NAV_HEIGHT }}
      className="sticky top-0 items-center justify-between bg-background px-2 inline-flex sm:hidden w-full flex-1 z-10"
    >
      {/* {showIcon && <SidebarDrawer />} */}

      <Title />
      <div className="flex items-center gap-2">
        {/* <NewNodeButton /> */}

        {showIcon && <PaletteDrawer />}
      </div>
    </div>
  )
}
