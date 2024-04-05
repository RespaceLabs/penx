import { Box } from '@fower/react'
import { useActiveNodes, useRouterStore } from '@penx/hooks'
import { Node } from '@penx/model'
import { PaletteDrawer } from '../PaletteDrawer'
import { SidebarDrawer } from '../SidebarDrawer/SidebarDrawer'

function Title() {
  const { activeNodes } = useActiveNodes()
  const router = useRouterStore()

  if (router.isTodos()) {
    return (
      <Box fontBold textLG>
        Tasks
      </Box>
    )
  }

  if (!activeNodes.length) {
    return <div>GOGO</div>
  }
  const node = new Node(activeNodes[0])

  return (
    <Box fontBold textLG>
      {node.title}
    </Box>
  )
}

export const MobileNav = () => {
  return (
    <Box
      h-48
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
      <SidebarDrawer />
      <Title></Title>
      <Box toCenterY gap-2>
        {/* <NewNodeButton /> */}
        <PaletteDrawer />
      </Box>
    </Box>
  )
}
