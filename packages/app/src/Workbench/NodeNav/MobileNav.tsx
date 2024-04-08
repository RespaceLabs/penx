import { Box } from '@fower/react'
import { WORKBENCH_NAV_HEIGHT } from '@penx/constants'
import { useActiveNodes, useRouterStore } from '@penx/hooks'
import { Node } from '@penx/model'
import { useNodeContext } from '@penx/node-hooks'
import { PaletteDrawer } from '../PaletteDrawer'
import { SidebarDrawer } from '../SidebarDrawer/SidebarDrawer'
import { Breadcrumb } from './Breadcrumb'

function Title() {
  const { activeNodes } = useActiveNodes()
  const router = useRouterStore()

  if (router.isTodos()) {
    return (
      <Box fontSemibold textLG>
        Tasks
      </Box>
    )
  }

  if (!activeNodes.length) {
    return <div></div>
  }

  const node = new Node(activeNodes[0])

  if (node.isDaily || node.isDatabaseRoot) {
    return (
      <Box fontSemibold textLG>
        {node.title}
      </Box>
    )
  }

  return (
    <Box px4 w-100vw overflowXAuto mx--8 py1>
      <Breadcrumb />
    </Box>
  )
}

export const MobileNav = () => {
  const routerStore = useRouterStore()
  const { node } = useNodeContext()
  const showIcon =
    routerStore.isTodos() ||
    node?.isDaily ||
    node?.isDatabaseRoot ||
    node?.isDailyRoot ||
    node?.isDatabase

  return (
    <Box
      h={WORKBENCH_NAV_HEIGHT}
      sticky
      top0
      toCenterY
      toBetween
      bgWhite
      px2
      display={['inline-flex', 'inline-flex', 'none']}
      w-100p
      flex-1
      zIndex-10
    >
      {showIcon && <SidebarDrawer />}

      <Title />
      <Box toCenterY gap-2>
        {/* <NewNodeButton /> */}

        {showIcon && <PaletteDrawer />}
      </Box>
    </Box>
  )
}
