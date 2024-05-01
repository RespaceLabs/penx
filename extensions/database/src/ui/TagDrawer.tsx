import { Box, styled } from '@fower/react'
import { Drawer } from 'vaul'
import { TagForm } from '@penx/database-ui'
import { useTagDrawer } from '../hooks/useTagDrawer'

const DrawerOverlay = styled(Drawer.Overlay)
const DrawerContent = styled(Drawer.Content)

export const TagDrawer = () => {
  const { isOpen, close, open, databaseId, path } = useTagDrawer()

  return (
    <Drawer.Root
      shouldScaleBackground
      open={isOpen}
      onOpenChange={(o) => {
        if (o) {
          open({})
        } else {
          close()
        }
      }}
    >
      <Drawer.Portal>
        <DrawerOverlay fixed bgBlack--T60 zIndex-100 css={{ inset: 0 }} />
        <DrawerContent
          overflowHidden
          bgWhite
          column
          roundedTop2XL
          // h={`calc(100vh - 40px)`}
          h-94vh
          fixed
          bottom-0
          left-0
          right-0
          zIndex-101
          autoFocus
          outlineNone
          // overflowHidden
        >
          <TagForm databaseId={databaseId} path={path} />
        </DrawerContent>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
