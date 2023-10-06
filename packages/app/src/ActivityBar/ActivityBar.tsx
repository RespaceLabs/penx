import { Box } from '@fower/react'
import { Avatar, AvatarFallback } from 'uikit'
import { useSpaces, useSpaceService } from '@penx/hooks'
import type { ISpace } from '@penx/local-db'
import { Logo } from '../components/Logo'
import { CreateSpaceModal } from '../EditorLayout/CreateSpaceModal'
import { SettingsModal } from '../EditorLayout/SettingsModal/SettingsModal'
import { MarketplaceModal } from '../Marketplace/MarketplaceModal'

function SpaceItem({
  item,
  activeSpace,
}: {
  item: ISpace
  activeSpace: ISpace
}) {
  const active = activeSpace.id === item.id
  const spaceService = useSpaceService()
  const size = 48
  return (
    <Box
      key={item.id}
      bgGray200={active}
      square={size}
      toCenter
      onClick={async () => {
        await spaceService.selectSpace(item.id)
      }}
    >
      <Avatar
        roundedFull
        rounded2XL={active}
        size={active ? size * 0.76 : size * 0.7}
      >
        <AvatarFallback>{item.name}</AvatarFallback>
      </Avatar>
    </Box>
  )
}

export const ActivityBar = () => {
  const { spaces, activeSpace } = useSpaces()

  return (
    <Box h-100vh w-48 borderRight borderGray100 column gapY2 py2 toCenterX>
      <Logo showText={false} mb4 to="/" />
      <Box flex-1>
        {spaces?.map((item) => (
          <SpaceItem key={item.id} item={item} activeSpace={activeSpace} />
        ))}
        <Box toCenter mt4>
          <CreateSpaceModal />
        </Box>
      </Box>

      <MarketplaceModal />
      <SettingsModal />
    </Box>
  )
}
